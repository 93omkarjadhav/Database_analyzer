import React from "react";
import { ArrowRight } from "lucide-react";

function DashboardPage({ onGetStarted, onSignIn }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0906] text-stone-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,180,80,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_25%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#f8b35a]/20 blur-3xl" />
      <div className="absolute -right-16 bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <button onClick={onGetStarted} className="flex items-center gap-3 text-left">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-[11px] font-black tracking-[0.28em] text-white shadow-lg shadow-black/20">
            SA
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-[0.22em] uppercase text-white">
              sql Agent
            </span>
            <span className="block text-xs text-stone-400">
              Database intelligence dashboard
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 text-sm text-stone-300 lg:flex">
          <a href="#product" className="transition-colors hover:text-white">
            Product
          </a>
          <a href="#enterprise" className="transition-colors hover:text-white">
            Enterprise
          </a>
          <a href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </a>
          <a href="#resources" className="transition-colors hover:text-white">
            Resources
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSignIn}
            className="rounded-full px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:text-white"
          >
            Sign in
          </button>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Get started
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24 lg:pt-20">
        <section className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/90">
            Built for database teams
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[1] text-white sm:text-6xl lg:text-7xl">
            Make SQL work feel sharper, faster, and easier to trust.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
            sql Agent gives your team a focused dashboard for reviewing queries,
            spotting bugs, and moving from rough data to clean answers without
            losing context.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-full bg-[#f3efe8] px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              Get started
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onSignIn}
              className="rounded-full border border-white/[0.12] bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sign in
            </button>
          </div>

          <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Query review
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-200">
                Inspect SQL before it ships and keep the fix inline.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Schema clarity
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-200">
                Understand table relationships and edge cases quickly.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Shared context
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-200">
                Keep every investigation tied to the same working session.
              </p>
            </div>
          </div>
        </section>

        <section className="lg:pl-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#11100d]/95 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-white/20" />
                <span className="h-3 w-3 rounded-full bg-white/20" />
                <span className="h-3 w-3 rounded-full bg-white/20" />
              </div>
              <span className="font-medium text-stone-300">sql Agent</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-300">
                localhost:3000
              </span>
            </div>

            <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="bg-[#0f0e0b] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Ready for review 6
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    ["Build Landing Page", "Done. Fonts preloaded in the head..."],
                    ["Analyze Tab Usage", "All set. We now track focus..."],
                    ["Plan Mission Control", "+20 • Drafted implementation..."],
                    ["PyTorch MNIST Experiments", "10m"],
                  ].map(([title, subtitle], index) => (
                    <div
                      key={title}
                      className={`rounded-2xl border px-3 py-3 ${
                        index === 0
                          ? "border-white/10 bg-white/[0.06]"
                          : "border-transparent bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm text-white">
                        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                        <span className="truncate">{title}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        {subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="bg-[#13110d] p-5">
                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-white/10 bg-[#161411] p-5">
                    <p className="text-sm font-semibold text-white">
                      Build dashboard landing page
                    </p>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-stone-200">
                      make a landing page based on the attached docs explaining
                      what we do
                    </div>
                    <div className="mt-6 space-y-3 text-sm text-stone-300">
                      <p>Read brand-guidelines.pdf</p>
                      <p>Read about-acme.md</p>
                      <p className="text-stone-500">Thought 6s</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-[#161411] p-5">
                    <p className="text-sm font-semibold text-white">Project notes</p>
                    <div className="mt-4 space-y-4 text-sm text-stone-300">
                      <div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-stone-500">
                          <span>Accuracy</span>
                          <span>96%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/[0.08]">
                          <div className="h-2 w-[96%] rounded-full bg-[#f3efe8]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-stone-500">
                          <span>Latency</span>
                          <span>180ms</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/[0.08]">
                          <div className="h-2 w-[72%] rounded-full bg-[#f8b35a]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-stone-500">
                          <span>Coverage</span>
                          <span>8 tables</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/[0.08]">
                          <div className="h-2 w-[84%] rounded-full bg-white/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-[#161411] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      Teams
                    </p>
                    <p className="mt-2 text-sm text-stone-200">
                      Keep product, engineering, and data in one review loop.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[#161411] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      Safety
                    </p>
                    <p className="mt-2 text-sm text-stone-200">
                      Catch risky SQL before it reaches production systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;