function smove_forward!(G, i, t, x, θ, t′, Z::Union{BouncyParticle, ZigZag})
    nhd = neighbours(G, i)
    for i in nhd
        t[i], x[i] = t′, x[i] + θ[i]*(t′ - t[i])
    end
    t, x, θ
end
function smove_forward!(i::Int, t, x, θ, t′, Z::Union{BouncyParticle, ZigZag})
    t[i], x[i] = t′, x[i] + θ[i]*(t′ - t[i])
    return t, x, θ
end

function smove_forward!(t, x, θ, t′, Z::Union{BouncyParticle, ZigZag})
    for i in eachindex(x)
        t[i], x[i] = t′, x[i] + θ[i]*(t′ - t[i])
    end
    t, x, θ
end
function smove_forward!(G, i, t, x, θ, t′, B::Union{Boomerang, FactBoomerang})
    nhd = neighbours(G, i)
    for i in nhd
        τ = t′ - t[i]
        s, c = sincos(τ)
        t[i], x[i], θ[i] = t′, (x[i] - B.μ[i])*c + θ[i]*s + B.μ[i],
                    -(x[i] - B.μ[i])*s + θ[i]*c
    end
    t, x, θ
end

function smove_forward!(t, x, θ, t′, B::Union{Boomerang, FactBoomerang})
    for i in eachindex(x)
        τ = t′ - t[i]
        s, c = sincos(τ)
        t[i], x[i], θ[i] = t′, (x[i] - B.μ[i])*c + θ[i]*s + B.μ[i],
                    -(x[i] - B.μ[i])*s + θ[i]*c
    end
    t, x, θ
end

function event(i, t::Vector, x, θ, Z::Union{ZigZag,FactBoomerang})
    t[i], i, x[i], θ[i]
end

"""
    SelfMoving()

Indicates as `args[1]` that `∇ϕ` depends only on few coeffients
and takes responsibility to call `smove_forward!`
"""
struct SelfMoving
end
export SelfMoving
∇ϕ_(∇ϕ, t, x, θ, i, t′, Z, args...) = ∇ϕ(x, i, args...)
∇ϕ_(∇ϕ, t, x, θ, i, t′, Z, S::SelfMoving, args...) = ∇ϕ(t, x, θ, i, t′, Z, args...)
sλ(∇ϕi, i, x, θ, Z::Union{ZigZag,FactBoomerang}) = λ(∇ϕi, i, x, θ, Z)
sλ̄((a,b), Δt) = pos(a + b*Δt)

function spdmp_inner!(rng, G, G1, G2, ∇ϕ, t, x, θ, Q, c, b, t_old, (acc, num),
     F::Union{ZigZag,FactBoomerang}, args...; factor=1.5, adapt=false, adaptscale=false)
    n = length(x)
    while true
        i, t′ = peek(Q)
        refresh = i > n
        if refresh
            i = rand(1:n)
        end
        t, x, θ = smove_forward!(G, i, t, x, θ, t′, F)
        if refresh
            i = rand(1:n)
            t, x, θ = smove_forward!(G2, i, t, x, θ, t′, F)
            if adaptscale && F isa ZigZag
                adapt_γ = 0.01; adapt_t0 = 15.; adapt_κ = 0.75
                pre = log(2.0) - sqrt(1.0 + t′)/(adapt_γ*(1.0 + t′ + adapt_t0))*log((1+acc[i])/(1.0 + 0.3*t′))
                η = (1 + t′)^(-adapt_κ)
                F.σ[i] = exp(η*pre + (1-η)*log(F.σ[i]))
                θ[i] = F.σ[i]*sign(θ[i])
            else
                if adaptscale
                    effi = (1 + 2*F.ρ/(1 - F.ρ))
                    τ = effi/(t[i]*F.λref)
                    if τ < 0.2
                        F.σ[i] = F.σ[i]*exp(((0.3t[i]/acc[i] > 1.66) - (0.3t[i]/acc[i] < 0.6))*0.03*min(1.0, sqrt(τ/F.λref)))
                    end
                end
                if F isa ZigZag && eltype(θ) <: Number
                    θ[i] = F.σ[i]*rand((-1,1))
                else
                    θ[i] = F.ρ*θ[i] + F.ρ̄*F.σ[i]*randn(eltype(θ))
                end
            end
  
            #renew refreshment
            Q[(n + 1)] = t′ + waiting_time_ref(F)
            #update reflections
            for j in neighbours(G1, i)
                b[j] = ab(G1, j, x, θ, c, F)
                t_old[j] = t[j]
                Q[j] = t[j] + poisson_time(b[j], rand(rng))
            end
        else
            # G neighbours have moved (and all others are not our responsibility)

            ∇ϕi = ∇ϕ_(∇ϕ, t, x, θ, i, t′, F, args...)
            l, lb = sλ(∇ϕi, i, x, θ, F), sλ̄(b[i], t[i] - t_old[i])
            num += 1
            if rand(rng)*lb < l
                acc[i] += 1
                if l >= lb
                    !adapt && error("Tuning parameter `c` too small.")
                    #acc .= 0 
                    #num = 0
                    adapt!(c, i, factor)
                end
                t, x, θ = smove_forward!(G2, i, t, x, θ, t′, F)
                θ = reflect!(i, ∇ϕi, x, θ, F)
                for j in neighbours(G1, i)
                    b[j] = ab(G1, j, x, θ, c, F)
                    t_old[j] = t[j]
                    Q[j] = t[j] + poisson_time(b[j], rand(rng))
                end
            else
                b[i] = ab(G1, i, x, θ, c, F)
                t_old[i] = t[i]
                Q[i] = t[i] + poisson_time(b[i], rand(rng))
                continue
            end
        end
        return event(i, t, x, θ, F), t, x, θ, t′, (acc, num), c, b, t_old
    end
end

"""
    spdmp(∇ϕ, t0, x0, θ0, T, c, [G,] F::Union{ZigZag,FactBoomerang}, args...;
        factor=1.5, adapt=false)
        = Ξ, (t, x, θ), (acc, num), c

Version of spdmp which assumes that `i` only depends on coordinates
`x[j] for j in neighbours(G, i)`.

It returns a `FactTrace` (see [`Trace`](@ref)) object `Ξ`, which can be collected
into pairs `t => x` of times and locations and discretized with `discretize`.
Also returns the `num`ber of total and `acc`epted Poisson events and updated bounds
`c` (in case of `adapt==true` the bounds are multiplied by `factor` if they turn
out to be too small.) The final time, location and momentum at `T` can be obtained
with `smove_forward!(t, x, θ, T, F)`.
"""
function spdmp(∇ϕ, t0, x0, θ0, T, c, G, F::Union{ZigZag,FactBoomerang}, args...;
        factor=1.8, adapt=false, adaptscale=false, progress=false, progress_stops = 20, seed=Seed())
    n = length(x0)

    rng = Rng(seed)
    t′ = t0
    t = fill(t′, size(θ0)...)
    t_old = copy(t)
    G1 = [i => rowvals(F.Γ)[nzrange(F.Γ, i)] for i in eachindex(θ0)]
    if G === nothing
        G = G1
    end
    @assert all(a.second ⊇ b.second for (a,b) in zip(G, G1))
    G2 = [i => setdiff(union((G1[j].second for j in G1[i].second)...), G[i].second) for i in eachindex(G1)]
    x, θ = copy(x0), copy(θ0)
    num = 0
    acc = zeros(Int, length(θ))
    Q = SPriorityQueue{Int,Float64}()
    b = [ab(G1, i, x, θ, c, F) for i in eachindex(θ)]
    for i in eachindex(θ)
        enqueue!(Q, i => poisson_time(b[i], rand(rng)))
    end
    if hasrefresh(F)
        enqueue!(Q, (n + 1) => waiting_time_ref(F))
    end
    if progress
        prg = Progress(progress_stops, 1)
    else
        prg = missing
    end
    stops = ismissing(prg) ? 0 : max(prg.n - 1, 0) # allow one stop for cleanup
    tstop = T/stops
    Ξ = Trace(t0, x0, θ0, F)
    while t′ < T
        ev, t, x, θ, t′, (acc, num), c,  b, t_old = spdmp_inner!(rng, G, G1, G2, ∇ϕ, t, x, θ, Q,
                    c, b, t_old, (acc, num), F, args...; factor=factor, adapt=adapt, adaptscale=adaptscale)
        push!(Ξ, ev)
        if t′ > tstop
            tstop += T/stops
            next!(prg) 
        end  
    end
    ismissing(prg) || ProgressMeter.finish!(prg)
    #t, x, θ = smove_forward!(t, x, θ, T, F)
    Ξ, (t, x, θ), (acc, num), c
end

spdmp(∇ϕ, t0, x0, θ0, T, c, F::Union{ZigZag,FactBoomerang}, args...; kargs...) = spdmp(∇ϕ, t0, x0, θ0, T, c, nothing, F, args...; kargs...) 