var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = ZigZagBoomerang","category":"page"},{"location":"#ZigZagBoomerang","page":"Home","title":"ZigZagBoomerang","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Back to repository: https://github.com/mschauer/ZigZagBoomerang.jl","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [ZigZagBoomerang]","category":"page"},{"location":"#ZigZagBoomerang.Boomerang","page":"Home","title":"ZigZagBoomerang.Boomerang","text":"Boomerang(μ, λ) <: ContinuousDynamics\n\nDynamics preserving the N(μ, I) measure (Boomerang) with refreshment time λ\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.Boomerang1d","page":"Home","title":"ZigZagBoomerang.Boomerang1d","text":"Boomerang1d(Σ, μ, λ) <: ContinuousDynamics\n\n1-d toy boomerang samper. Dynamics preserving the N(μ, Σ) measure with refreshment time λ.\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.Bps","page":"Home","title":"ZigZagBoomerang.Bps","text":"Bps(λ) <: ContinuousDynamics\n\nBouncy particle sampler,  λ is the refreshment rate, which has to be strictly positive.\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.ContinuousDynamics","page":"Home","title":"ZigZagBoomerang.ContinuousDynamics","text":"ContinuousDynamics\n\nAbstract type for the deterministic dynamics of PDMPs\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.FactBoomerang","page":"Home","title":"ZigZagBoomerang.FactBoomerang","text":"FactBoomerang(Γ, μ, λ) <: ContinuousDynamics\n\nFactorized Boomerang dynamics preserving the N(μ, inv(Diagonal(Γ))) measure with refreshment time λ.\n\nExploits the conditional independence structure of the target measure, in form the argument Γ, a sparse precision matrix approximating target precision. μ is the approximate target mean.\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.FactTrace","page":"Home","title":"ZigZagBoomerang.FactTrace","text":"FactTrace\n\nSee Trace.\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.ZigZag","page":"Home","title":"ZigZagBoomerang.ZigZag","text":"struct ZigZag(Γ, μ) <: ContinuousDynamics\n\nLocal ZigZag sampler which exploits any independence structure of the target measure, in form the argument Γ, a sparse precision matrix approximating target precision. μ is the approximate target mean.\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.ZigZag1d","page":"Home","title":"ZigZagBoomerang.ZigZag1d","text":"ZigZag1d <: ContinuousDynamics\n\n1-d toy ZigZag sampler, dynamics preserving the Lebesgue measure.\n\n\n\n\n\n","category":"type"},{"location":"#ZigZagBoomerang.Trace-Union{Tuple{T}, Tuple{T,Any,Any,Union{FactBoomerang, ZigZag}}} where T","page":"Home","title":"ZigZagBoomerang.Trace","text":"Trace(t0::T, x0, θ0, F::Union{ZigZag,FactBoomerang})\n\nTrace object for exact trajectory of pdmp samplers. Returns an iterable FactTrace object. Note that iteration iterates pairs t => x where the vector x is modified inplace, so copies have to be made if the x is to be saved. collect applied to a trace object automatically copies x. discretize returns a discretized version.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.ab-Tuple{Any,Any,Any,Any,Any,ZigZag}","page":"Home","title":"ZigZagBoomerang.ab","text":"ab(G, i, x, θ, c, Flow)\n\nReturns the constant term a and linear term b when computing the Poisson times from the upper upper bounding rates λᵢ(t) = max(a + b*t)^2. The factors a and b can be function of the current position x, velocity θ, tuning parameter c and the Graph G\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.discretize-Tuple{Any,Any}","page":"Home","title":"ZigZagBoomerang.discretize","text":"discretize(trace::FactTrace, dt)\n\nDiscretize trace with step-size dt. Returns iterable object iterating pairs t => x.\n\nIteration changes the vector x inplace, collect creates copies.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.discretize-Tuple{Array{T,1} where T,Any,Any}","page":"Home","title":"ZigZagBoomerang.discretize","text":"discretize(x::Vector, Flow, dt)\n\nTransform the output of the algorithm (a skeleton of points) to a trajectory. Simple 1-d version.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.idot-Tuple{Any,Any,Any}","page":"Home","title":"ZigZagBoomerang.idot","text":"idot(A, j, x) = dot(A[:, j], x)\n\nCompute column-vector dot product exploiting sparsity of A.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.move_forward!-Tuple{Any,Any,Any,Any,Union{ZigZagBoomerang.Boomerang, FactBoomerang}}","page":"Home","title":"ZigZagBoomerang.move_forward!","text":"move_forward!(τ, t, x, θ, B::Boomerang)\n\nUpdates the position x, velocity θ and time t of the process after a time step equal to τ according to the deterministic dynamics of the Boomerang sampler which are the Hamiltonian dynamics preserving the Gaussian measure: : xt = μ +(x0 − μ)cos(t) + v_0sin(t), vt = −(x0 − μ)sin(t) + v_0cos(t) x: current location, θ: current velocity, t: current time.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.move_forward!-Tuple{Any,Any,Any,Any,Union{ZigZagBoomerang.Bps, ZigZag}}","page":"Home","title":"ZigZagBoomerang.move_forward!","text":"move_forward!(τ, t, x, θ, Z::Union{Bps, ZigZag})\n\nUpdates the position x, velocity θ and time t of the process after a time step equal to τ according to the deterministic dynamics of the Buoncy particle sampler (Bps) and ZigZag: (x(τ), θ(τ)) = (x(0) + θ(0)*t, θ(0)). x: current location, θ: current velocity, t: current time,\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.move_forward-Tuple{Any,Any,Any,Any,Boomerang1d}","page":"Home","title":"ZigZagBoomerang.move_forward","text":"move_forward(τ, t, x, θ, B::Boomerang1d)\n\nUpdates the position x, velocity θ and time t of the process after a time step equal to τ according to the deterministic dynamics of the Boomerang1d sampler: xt = μ +(x0 − μ)cos(t) + v_0sin(t), vt = −(x0 − μ)sin(t) + v_0cos(t) x: current location, θ: current velocity, t: current time.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.move_forward-Tuple{Any,Any,Any,Any,ZigZag1d}","page":"Home","title":"ZigZagBoomerang.move_forward","text":"move_forward(τ, t, x, θ, ::ZigZag1d)\n\nUpdates the position x, velocity θ and time t of the process after a time step equal to τ according to the deterministic dynamics of the ZigZag1d sampler: (x(τ), θ(τ)) = (x(0) + θ(0)*t, θ(0)). x: current location, θ: current velocity, t: current time,\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.neighbours-Tuple{Array{#s16,1} where #s16<:Pair,Any}","page":"Home","title":"ZigZagBoomerang.neighbours","text":"neighbours(G::Vector{<:Pair}, i) = G[i].second\n\nReturn extended neighbourhood of i including i. G: graphs of neightbourhoods\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.normsq-Tuple{Real}","page":"Home","title":"ZigZagBoomerang.normsq","text":"normsq(x)\n\nSquared 2-norm.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.pdmp-Tuple{Any,Any,Any,Any,Any,Any,Union{FactBoomerang, ZigZag},Vararg{Any,N} where N}","page":"Home","title":"ZigZagBoomerang.pdmp","text":"pdmp(∇ϕ, t0, x0, θ0, T, c, F::Union{ZigZag, FactBoomerang}, args...; factor=1.5, adapt=false) = Ξ, (t, x, θ), (acc, num)\n\nOuter loop of the factorised samplers, the Factorised Boomerang algorithm and the Zig-Zag sampler. Inputs are a function ∇ϕ giving ith element of gradient of negative log target density ∇ϕ(x, i, args...), starting time and position t0, x0, velocities θ0, and tuning vector c for rejection bounds and final clock T.\n\nThe process moves to time T with invariant mesure μ(dx) ∝ exp(-ϕ(x))dx and outputs a collection of reflection points which, together with the initial triple t, x θ are sufficient for reconstructuing continuously the continuous path. It returns a FactTrace (see Trace) object Ξ, which can be collected into pairs t => x of times and locations and discretized with discretize. Also returns the number of total and accepted Poisson events and updated bounds c (in case of adapt==true the bounds are multiplied by factor if they turn out to be too small.)\n\nThis version does not assume that ∇ϕ has sparse conditional dependencies, see spdmp.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.pdmp-Tuple{Any,Any,Any,Any,Any,ZigZagBoomerang.ContinuousDynamics}","page":"Home","title":"ZigZagBoomerang.pdmp","text":"pdmp(∇ϕ, x, θ, T, Flow::ContinuousDynamics; adapt=true,  factor=2.0)\n\nRun a piecewise deterministic process from location and velocity x, θ until time T. c is a tuning parameter for the upper bound of the Poisson rate. If adapt = false, c = c*factor is tried, otherwise an error is thrown.\n\nReturns vector of tuples (t, x, θ) (time, location, velocity) of direction change events.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.pdmp_inner!-Tuple{Any,Any,Any,Any,Any,Any,Any,Any,Any,Any,Any,Any,Union{FactBoomerang, ZigZag},Vararg{Any,N} where N}","page":"Home","title":"ZigZagBoomerang.pdmp_inner!","text":"pdmp_inner!(Ξ, G, ∇ϕ, t, x, θ, Q, a, b, t_old, (acc, num),\n    F::Union{ZigZag,FactBoomerang}, args...; factor=1.5, adapt=false)\n    = t, x, θ, (acc, num), c\n\nInner loop of the factorised samplers: the factorised Boomerang algorithm and the Zig-Zag sampler. Given a dependency graph G, gradient ∇ϕ, current position x, velocity θ, Queue of events Q, time t, tuning parameter c, terms of the affine bounds a,b and time when the upper bounds were computed t_old\n\nThe sampler 1) extracts from the queue the first event time. 2) moves deterministically according to its dynamics until event time. 3) Evaluates whether the event time is a accepted reflection or refreshment time or shadow time. 4) If it is a reflection time, the velocity reflects according its reflection rule, if it is a refreshment time, the sampler updates the velocity from its prior distribution (Gaussian). In both cases, updates Q according to the dependency graph G. The sampler proceeds until the next accepted reflection time or refreshment time. (num, acc) incrementally counts how many event times occour and how many of those are real reflection times.\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.poisson_time-Tuple{Any,Any,Any}","page":"Home","title":"ZigZagBoomerang.poisson_time","text":"poisson_time(a, b, u)\n\nObtaining waiting time for inhomogeneous Poisson Process with rate of the form λ(t) = (a + b*t)^+, a,b ∈ R, u uniform random variable\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.poisson_time-Tuple{Any,Any}","page":"Home","title":"ZigZagBoomerang.poisson_time","text":"poisson_time(a[, u])\n\nObtaining waiting time for homogeneous Poisson Process with rate of the form λ(t) = a, a ≥ 0, u uniform random variable\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.pos-Tuple{Any}","page":"Home","title":"ZigZagBoomerang.pos","text":"pos(x)\n\nPositive part of x (i.e. max(0,x)).\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.reflect!-Tuple{Any,Any,Any,Union{FactBoomerang, ZigZag}}","page":"Home","title":"ZigZagBoomerang.reflect!","text":"    reflect!(i, x, θ, F)\n\nReflection rule of sampler F at reflection time. i: coordinate which flips sign, x: position, θ: velocity (position not used for the ZigZag and FactBoomerang.)\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.spdmp-Tuple{Any,Any,Any,Any,Any,Any,Union{FactBoomerang, ZigZag},Vararg{Any,N} where N}","page":"Home","title":"ZigZagBoomerang.spdmp","text":"spdmp(∇ϕ, t0, x0, θ0, T, c, F::Union{ZigZag,FactBoomerang}, args...;\n    factor=1.5, adapt=false)\n\nVersion of spdmp which assumes that i only depends on coordinates x[j] for j in neighbours(G, i).\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.λ-Tuple{Any,Any,Any,Any,FactBoomerang,Vararg{Any,N} where N}","page":"Home","title":"ZigZagBoomerang.λ","text":"λ(∇ϕ, i, x, θ, Z::FactBoomerang)\n\nith Poisson rate of the FactBoomerang sampler\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.λ-Tuple{Any,Any,Any,Any,ZigZag,Vararg{Any,N} where N}","page":"Home","title":"ZigZagBoomerang.λ","text":"λ(∇ϕ, i, x, θ, Z::ZigZag)\n\nith Poisson rate of the ZigZag sampler\n\n\n\n\n\n","category":"method"},{"location":"#ZigZagBoomerang.λ_bar-Tuple{Any,Any,Any,Any,Any,ZigZag}","page":"Home","title":"ZigZagBoomerang.λ_bar","text":"λ_bar(G, i, x, θ, c, Z)\n\nComputes the bounding rate λ_bar at position x and velocity θ.\n\n\n\n\n\n","category":"method"},{"location":"#Literature","page":"Home","title":"Literature","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Joris Bierkens, Paul Fearnhead, Gareth Roberts: The Zig-Zag Process and Super-Efficient Sampling for Bayesian Analysis of Big Data. The Annals of Statistics, 2019, 47. Vol., Nr. 3, pp. 1288-1320. https://arxiv.org/abs/1607.03188.\nJoris Bierkens, Sebastiano Grazzi, Kengo Kamatani and Gareth Robers: The Boomerang Sampler. ICML 2020. https://arxiv.org/abs/2006.13777.\nJoris Bierkens, Sebastiano Grazzi, Frank van der Meulen, Moritz Schauer: A piecewise deterministic Monte Carlo method for diffusion bridges.  2020. https://arxiv.org/abs/2001.05889.\nhttps://github.com/jbierkens/ICML-boomerang/ (code accompanying the paper \"The Boomerang Sampler\")","category":"page"}]
}
