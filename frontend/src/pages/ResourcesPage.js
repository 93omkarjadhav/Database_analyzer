import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { 
  Search, BookOpen, Clock, Code, ArrowRight, 
  Sparkles, FileText, CheckCircle2, Copy 
} from "lucide-react";

const ARTICLES = [
  {
    title: "Understanding B-Tree Indexes in PostgreSQL",
    desc: "A deep dive into how B-Tree indexes structure data on disk, search traversal logic, and when composite index ordering matters.",
    tag: "Guides",
    db: "PostgreSQL",
    readTime: "7 min read",
    date: "June 14, 2026"
  },
  {
    title: "How We Optimized Acme's Join Latency by 94%",
    desc: "A real-world case study on identifying index-misses in composite JOIN paths and using EXPLAIN ANALYZE to debug slow queries.",
    tag: "Case Studies",
    db: "MySQL",
    readTime: "11 min read",
    date: "May 28, 2026"
  },
  {
    title: "Avoid the NOT IN Pitfall with Nullable Columns",
    desc: "Learn why NOT IN queries can result in unexpected empty result sets or table-scan bottlenecks, and how to write them using EXISTS.",
    tag: "Guides",
    db: "SQL Architecture",
    readTime: "5 min read",
    date: "May 09, 2026"
  },
  {
    title: "sql Agent Version 1.4: Direct MySQL Tunneling",
    desc: "Announcing SSH tunneling support for secure connections to remote staging environments, and improved EXPLAIN node graphs.",
    tag: "Release Notes",
    db: "Updates",
    readTime: "3 min read",
    date: "April 30, 2026"
  }
];

function ResourcesPage({ navigateTo }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Interactive Formatter State
  const [sqlContent, setSqlContent] = useState("SELECT u.id, u.email, o.total_amount FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' ORDER BY o.total_amount DESC;");
  const [formattedSql, setFormattedSql] = useState("");
  const [explainSummary, setExplainSummary] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Developer Resources & Docs | sql Agent";
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.name = "description";
    meta.content = "Browse database optimization blogs, SQL guides, version release notes, and try our live interactive SQL Formatter and Explainer tool.";
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  const handleFormatExplain = () => {
    if (!sqlContent.trim()) return;

    // Simple regex SQL formatter logic (mock logic but behaves accurately)
    let formatted = sqlContent
      .replace(/\s+/g, " ")
      .replace(/\b(SELECT|FROM|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT)\b/gi, "\n$1")
      .trim();

    setFormattedSql(formatted);

    // Simple mock explain synthesis
    let explanation = "This query retrieves ";
    if (sqlContent.toLowerCase().includes("u.email")) explanation += "user emails, ";
    if (sqlContent.toLowerCase().includes("o.total_amount")) explanation += "order amounts, ";
    explanation += "by joining the 'users' and 'orders' tables on the user identifier. ";
    
    if (sqlContent.toLowerCase().includes("where")) {
      explanation += "It filters rows where status is 'active'. ";
    }
    if (sqlContent.toLowerCase().includes("order by")) {
      explanation += "The results are sorted in descending order of order totals.";
    }

    setExplainSummary(explanation);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedSql || sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredArticles = selectedCategory === "All" 
    ? ARTICLES 
    : ARTICLES.filter(art => art.tag === selectedCategory);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0906] text-stone-50">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(248,179,90,0.12),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_transparent_32%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] pointer-events-none" />

      <Navbar currentPath="/resources" navigateTo={navigateTo} />

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        
        {/* Page Header */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8b35a]/25 bg-[#f8b35a]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8b35a]">
            Knowledge Base
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Deepen your database knowledge.
          </h1>
          <p className="mt-6 text-base text-stone-300 sm:text-lg leading-relaxed">
            Read engineering tutorials written by database administrators, view optimization case studies, or format your queries with our tools.
          </p>
        </section>

        {/* SQL Formatting Sandbox Tool */}
        <section className="mb-20">
          <div className="rounded-3xl border border-white/10 bg-[#11100d]/90 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sandbox Controls */}
              <div className="lg:w-2/5 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs text-[#f8b35a] font-semibold mb-3">
                    <Code size={13} />
                    Developer Utilities
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-wide">
                    SQL Formatter & Explainer
                  </h2>
                  <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                    Paste raw, unformatted SQL queries below. Our editor will structure it, indent statement verbs, and generate a semantic natural language explanation.
                  </p>

                  <div className="mt-5">
                    <textarea
                      id="sql-input"
                      rows={5}
                      value={sqlContent}
                      onChange={(e) => setSqlContent(e.target.value)}
                      placeholder="SELECT * FROM customers WHERE active = 1..."
                      className="w-full rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-stone-300 focus:border-[#f8b35a] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    id="btn-format-sql"
                    onClick={handleFormatExplain}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-semibold text-black hover:bg-stone-200 transition-colors"
                  >
                    Format & Explain Query
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Sandbox Outputs */}
              <div className="flex-1 flex flex-col min-h-[300px] rounded-2xl border border-white/10 bg-[#0c0a07] overflow-hidden">
                <div className="flex items-center justify-between bg-black/40 px-5 py-3 border-b border-white/[0.08]">
                  <span className="text-xs text-stone-400 font-mono select-none">Output Sandbox</span>
                  {formattedSql && (
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-xs text-[#f8b35a] hover:underline"
                    >
                      <Copy size={12} />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>

                <div className="flex-1 p-5 font-mono text-xs leading-relaxed overflow-x-auto min-h-[160px]">
                  {formattedSql ? (
                    <pre className="text-stone-200 whitespace-pre">{formattedSql}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-500 font-sans italic text-xs">
                      Formatted SQL output will appear here after clicking format...
                    </div>
                  )}
                </div>

                {explainSummary && (
                  <div className="bg-[#11100d] px-5 py-4 border-t border-white/[0.08]">
                    <div className="flex items-center gap-1.5 text-xs text-[#f8b35a] font-semibold mb-2">
                      <Sparkles size={12} />
                      Semantic Explanation
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {explainSummary}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Resources Grid & Filters */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <h2 className="text-xl font-semibold text-white tracking-wide">
              Engineering Catalog
            </h2>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {["All", "Guides", "Case Studies", "Release Notes"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-[#f8b35a]/10 border border-[#f8b35a]/30 text-[#f8b35a]"
                      : "bg-white/5 border border-white/5 text-stone-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredArticles.map((art, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-white/[0.01] p-6 hover:border-white/10 transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-stone-300 font-semibold border border-white/5">
                      {art.tag}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-[#f8b35a] transition-colors tracking-wide">
                    {art.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-stone-400">
                    {art.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f8b35a]/80">
                    Topic: {art.db}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-stone-300 font-medium group-hover:text-white transition-colors">
                    Read Article
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default ResourcesPage;
