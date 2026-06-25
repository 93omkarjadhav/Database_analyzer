import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { 
  ArrowRight, Zap, Database, Search, Sparkles, 
  ShieldAlert, Gauge, FileCode, CheckCircle2 
} from "lucide-react";

const QUERY_TEMPLATES = [
  {
    id: "unindexed-join",
    name: "Unindexed JOIN",
    description: "Slow nested loop JOIN on large customer & orders tables.",
    beforeQuery: `SELECT c.name, o.order_date, o.total_amount \nFROM customers c \nJOIN orders o ON c.uuid = o.customer_uuid \nWHERE c.status = 'active' \nORDER BY o.total_amount DESC LIMIT 50;`,
    beforeExplain: "Table scan on 'orders' (1.2M rows). Nested loop without index match. Execution: 2,410ms.",
    afterQuery: `SELECT c.name, o.order_date, o.total_amount \nFROM customers c \nINNER JOIN orders o ON c.uuid = o.customer_uuid \nWHERE c.status = 'active' \n-- OPTIMIZATION: Index applied on orders(customer_uuid, total_amount)\nORDER BY o.total_amount DESC LIMIT 50;`,
    afterExplain: "Index scan on 'idx_orders_customer_total'. Index condition pushdown. Execution: 12ms.",
    speedup: "200x Faster",
    percentage: 99.5
  },
  {
    id: "inefficient-subquery",
    name: "Subquery vs EXISTS",
    description: "Subquery with NOT IN evaluating millions of records, blocking CPU.",
    beforeQuery: `SELECT product_id, product_name \nFROM products \nWHERE product_id NOT IN (\n  SELECT DISTINCT product_id FROM sales_history\n);`,
    beforeExplain: "Materializing subquery. Full scan on 'products' & 'sales_history' (5.8M rows). Execution: 5,820ms.",
    afterQuery: `SELECT p.product_id, p.product_name \nFROM products p \nWHERE NOT EXISTS (\n  SELECT 1 FROM sales_history s \n  WHERE s.product_id = p.product_id\n);`,
    afterExplain: "Anti-join transform. Hash Join with index lookup. Execution: 38ms.",
    speedup: "153x Faster",
    percentage: 99.3
  },
  {
    id: "wildcard-search",
    name: "Leading Wildcard Search",
    description: "Inefficient text search using LIKE '%term%' bypassing indexing.",
    beforeQuery: `SELECT id, email, signup_date \nFROM users \nWHERE email LIKE '%@gmail.com' \nORDER BY signup_date DESC;`,
    beforeExplain: "Full table scan on 'users'. Cannot utilize index on 'email'. Execution: 890ms.",
    afterQuery: `SELECT id, email, signup_date \nFROM users \nWHERE email LIKE '%.gmail.com' -- Prefix rewrite\n   OR email LIKE '%@gmail.com' -- Fallback\n-- OPTIMIZATION: Generated column / reverse index\nORDER BY signup_date DESC;`,
    afterExplain: "Partition prune or Index scan on reverse email column. Execution: 18ms.",
    speedup: "49x Faster",
    percentage: 97.9
  }
];

function ProductPage({ navigateTo }) {
  const [selectedQuery, setSelectedQuery] = useState(QUERY_TEMPLATES[0]);
  const [optimizing, setOptimizing] = useState(false);
  const [step, setStep] = useState(0); // 0: before, 1: scanning, 2: completed

  useEffect(() => {
    document.title = "Product Features | sql Agent";
    // Add meta description dynamically
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.name = "description";
    meta.content = "Explore sql Agent's database intelligence features: automated index suggestions, query analysis, syntax auto-fixing, and performance optimizations.";
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  const handleRunOptimizer = () => {
    setOptimizing(true);
    setStep(1);
    
    // Simulate steps
    setTimeout(() => {
      setStep(2);
      setOptimizing(false);
    }, 1800);
  };

  const handleQueryChange = (template) => {
    setSelectedQuery(template);
    setStep(0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0906] text-stone-50">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(248,179,90,0.15),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.06),_transparent_32%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] pointer-events-none" />

      <Navbar currentPath="/product" navigateTo={navigateTo} />

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        
        {/* Header Hero */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8b35a]/25 bg-[#f8b35a]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8b35a]">
            <Sparkles size={13} className="text-[#f8b35a]" />
            SQL Intelligence Engine
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Supercharge your database workflow.
          </h1>
          <p className="mt-6 text-base text-stone-300 sm:text-lg leading-relaxed">
            sql Agent analyzes database structure, explains bottlenecks, and auto-generates 
            high-performance SQL. Spend less time guessing execution plans and more time building.
          </p>
        </section>

        {/* Live Simulator Section */}
        <section className="mb-20">
          <div className="rounded-3xl border border-white/10 bg-[#11100d]/90 p-5 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Menu & Details */}
              <div className="lg:w-1/3 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-wide">
                    Live Performance Optimizer
                  </h2>
                  <p className="mt-2 text-sm text-stone-400">
                    Select a slow query pattern below to see how sql Agent's engine parses, explains, and optimizes database execution.
                  </p>

                  <div className="mt-6 space-y-3">
                    {QUERY_TEMPLATES.map((q) => (
                      <button
                        key={q.id}
                        id={`btn-query-${q.id}`}
                        onClick={() => handleQueryChange(q)}
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${
                          selectedQuery.id === q.id
                            ? "border-[#f8b35a]/45 bg-[#f8b35a]/5 text-white shadow-[0_0_15px_rgba(248,179,90,0.08)]"
                            : "border-white/5 bg-white/[0.02] text-stone-300 hover:border-white/15"
                        }`}
                      >
                        <div className="font-semibold text-sm">{q.name}</div>
                        <div className="mt-1 text-xs text-stone-400 line-clamp-1">{q.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-white/15 pt-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                      <Zap size={18} />
                    </span>
                    <div>
                      <div className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Optimization Level</div>
                      <div className="text-lg font-bold text-[#f8b35a]">AI Suggested Indexes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Code Simulator */}
              <div className="flex-1 flex flex-col min-h-[380px] rounded-2xl border border-white/10 bg-[#0c0a07] overflow-hidden">
                {/* Code Window Header */}
                <div className="flex items-center justify-between bg-black/40 px-5 py-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <span className="h-3.5 w-3.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                    <span className="h-3.5 w-3.5 rounded-full bg-green-500/20 border border-green-500/40" />
                  </div>
                  <span className="text-xs text-stone-400 font-mono select-none">
                    sql_optimizer_engine.sql
                  </span>
                </div>

                {/* Code Viewer Workspace */}
                <div className="flex-1 p-5 font-mono text-sm leading-relaxed overflow-x-auto min-h-[220px]">
                  {step === 0 && (
                    <div className="text-stone-300">
                      <div className="text-[#f8b35a]/80 text-xs mb-3 font-sans select-none">// BEFORE OPTIMIZATION</div>
                      <pre className="text-rose-200/90 whitespace-pre">{selectedQuery.beforeQuery}</pre>
                      <div className="mt-6 p-3 rounded-lg border border-red-950/50 bg-red-950/20 text-red-300 text-xs flex items-start gap-2">
                        <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                        <span><strong>Bottleneck:</strong> {selectedQuery.beforeExplain}</span>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-300 my-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-[#f8b35a]" />
                      <p className="text-sm font-sans tracking-wide text-stone-400">Analyzing syntax structure & index pathways...</p>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="text-stone-300">
                      <div className="text-emerald-400/80 text-xs mb-3 font-sans select-none">// AFTER OPTIMIZATION (COMPLETED)</div>
                      <pre className="text-emerald-200/90 whitespace-pre">{selectedQuery.afterQuery}</pre>
                      
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border border-emerald-950/50 bg-emerald-950/20 text-emerald-300 text-xs flex items-start gap-2">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                          <span><strong>Result:</strong> {selectedQuery.afterExplain}</span>
                        </div>
                        <div className="p-3 rounded-lg border border-amber-950/50 bg-amber-950/20 text-amber-300 text-xs flex items-center justify-between">
                          <span>Execution Speedup:</span>
                          <span className="text-sm font-bold text-[#f8b35a]">{selectedQuery.speedup}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Code Window Footer / Action */}
                <div className="bg-black/25 px-5 py-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-stone-400 font-sans">
                    {step === 0 && "Ready to optimize"}
                    {step === 1 && "Running static analysis..."}
                    {step === 2 && "Optimized successfully"}
                  </div>
                  <div className="flex gap-2">
                    {step === 2 && (
                      <button
                        onClick={() => setStep(0)}
                        className="rounded-full px-4 py-2 text-xs font-semibold border border-white/10 hover:bg-white/5 text-stone-300 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      id="btn-run-optimizer"
                      onClick={handleRunOptimizer}
                      disabled={optimizing}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-stone-200 transition-colors disabled:opacity-50"
                    >
                      {optimizing ? "Optimizing..." : step === 2 ? "Run Again" : "Optimize SQL"}
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Product Capabilities Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center text-white tracking-wide">
            Designed for database performance engineering
          </h2>
          <p className="mt-2 text-center text-sm text-stone-400 max-w-xl mx-auto">
            Get absolute clarity over your database layers and queries without checking logs.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Search className="text-[#f8b35a]" size={20} />,
                title: "Live Execution Explainers",
                desc: "Automatically translate complex PostgreSQL or MySQL EXPLAIN plans into simple, interactive node visualizers."
              },
              {
                icon: <Gauge className="text-[#f8b35a]" size={20} />,
                title: "Real-time Metrics Tracking",
                desc: "Monitor execution times, query latency, disk write overhead, and query cache hit rates in one place."
              },
              {
                icon: <Sparkles className="text-[#f8b35a]" size={20} />,
                title: "AI Syntax Auto-fixing",
                desc: "Spot syntax defects, improper subqueries, and non-optimized JOIN paths and auto-fix with a single click."
              },
              {
                icon: <Database className="text-[#f8b35a]" size={20} />,
                title: "Multi-Source Integrations",
                desc: "Seamlessly query live MySQL, import raw slow-query log text files, or hook directly to staging databases."
              },
              {
                icon: <FileCode className="text-[#f8b35a]" size={20} />,
                title: "Safe SQL Previews",
                desc: "Preview query output safely in read-only sandbox before committing or running structural migration scripts."
              },
              {
                icon: <CheckCircle2 className="text-[#f8b35a]" size={20} />,
                title: "Team Review Loops",
                desc: "Track workspace notes, share slow-query logs, and keep code changes directly grouped by project sessions."
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/15 transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white tracking-wide">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-3xl border border-[#f8b35a]/20 bg-[radial-gradient(ellipse_at_center,_rgba(248,179,90,0.06),_transparent)] px-6 py-12 sm:px-12 sm:py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Bring high-fidelity context to database reviews
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-stone-300 text-sm sm:text-base leading-relaxed">
            Install in seconds. Link your local staging database or load sample query lists to see optimizations instantly.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigateTo("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-[#f3efe8] px-6 py-3 text-sm font-semibold text-black hover:bg-stone-200 transition-colors"
            >
              Get started for free
              <ArrowRight size={15} />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

export default ProductPage;
