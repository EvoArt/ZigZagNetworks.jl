# Implementation of d dimesional Boomerang and Bouncy particle sampler (the two
# most known not-factorised PDMC)
using LinearAlgebra
∇ϕ(x, F::Bps) = ∇ϕ(x)
∇ϕ(x, F::Boomerang) =  ∇ϕ(x) - (x - B.μ)
λ(∇ϕx, θ F::Union{Bps, Boomerang}) = pos(dot(θ,∇ϕ(x, F)))

# affine bounds for any commutative upper bound
λ_bar(x, θ, c, F::Union{Bps, Boomerang}) = pos(a + b*t)

# waiting times uses local structure
# Here use sparsity as the factorised samplers
function ab(x, θ, c, B::Bps)
    a = c + θ'*B.Γ*x
    b = θ'*B.Γ*x
end

function ab(x, θ, c, B::Boomerang)
    (sqrt(normsq(θ) + normsq((x - B.μ)))*c, zero(x))
end

waiting_time_ref(F::Union{Boomerang, Bps}) = poisson_time(F.λref)


# Algorithm for one dimensional pdmp (ZigZag1d or Boomerang)
"""
    pdmp(∇ϕ, x, θ, T, Flow::ContinuousDynamics; adapt=true,  factor=2.0)

Run a piecewise deterministic process from location and velocity `x, θ` until time
`T`. `c` is a tuning parameter for the upper bound of the Poisson rate.
If `adapt = false`, `c = c*factor` is tried, otherwise an error is thrown.

Returns vector of tuples `(t, x, θ)` (time, location, velocity) of
direction change events.
"""
function pdmp(∇ϕ, t, x, θ, T, c, Flow::Union{Bps, Boomerang}; adapt=false, factor=2.0)
    scaleT = Flow isa Boomerang1d ? 1.25 : 1.0
    T = T*scaleT
    t = zero(T)
    Ξ = [(t, x, θ)]
    τref = waiting_time_ref(Flow)
    num = acc = 0
    t′ =  t + poisson_time(ab(x, θ, c, Flow)..., rand())
    while t < T
        if τref < t′
            t, x, θ = move_forward(τref - t, t, x, θ, Flow)
            θ = randn(dot(θ,∇ϕ(x, F)))
            τref = t + waiting_time_ref(Flow)
            a, b = ab(x, θ, c, Flow)
            t′ = t + poisson_time(a,b, rand())
            push!(Ξ, (t, x, θ))
        else
            τ = t′ - t
            t, x, θ = move_forward(τ, t, x, θ, Flow)
            ∇ϕx = ∇ϕx(x, F)
            l, lb = λ(∇ϕx, θ), λbar(τ, a,b)
            num += 1
            if rand()*lb < l
                acc += 1
                if l >= lb
                    !adapt && error("Tuning parameter `c` too small.")
                    c *= factor
                end
                reflect!(∇ϕx, θ, x, Flow)
                push!(Ξ, (t, x, θ))
            end
        end
        a, b = ab(x, θ, c, Flow)
        t′ = t + poisson_time(a, b, rand())
    end
    return Ξ, acc/num
end
