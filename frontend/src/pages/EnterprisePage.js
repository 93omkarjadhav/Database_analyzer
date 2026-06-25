import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { 
  ShieldCheck, Server, Key, FileCheck2, Cpu, 
  HelpCircle, MessageSquare, ArrowRight, Building, CheckCircle2 
} from "lucide-react";

function EnterprisePage({ navigateTo }) {
  // Simulator State
  const [deployment, setDeployment] = useState("vpc");
  const [sla, setSla] = useState("99.99");
  const [securityPackage, setSecurityPackage] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    document.title = "Enterprise Database Intelligence | sql Agent";
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.name = "description";
    meta.content = "sql Agent Enterprise. High-performance SQL optimization and database analysis self-hosted in your VPC, fully compliant with SOC2, GDPR, and HIPAA.";
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  const calculateEstimate = () => {
    let monthlySLA = sla === "99.99" ? "Uptime SLA (4m response)" : "Standard Uptime SLA";
    let securityFeatures = securityPackage 
      ? ["Audit logging enabled", "Local static LLM validation", "Air-gapped database isolation"]
      : ["Standard isolation"];
    
    return {
      monthlySLA,
      securityFeatures,
      supportType: sla === "99.99" ? "24/7 Dedicated Engineering" : "Business Hours Priority Email"
    };
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !company) return;
    
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

  const estimate = calculateEstimate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0906] text-stone-50">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(248,179,90,0.12),_transparent_38%),radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_30%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] pointer-events-none" />

      <Navbar currentPath="/enterprise" navigateTo={navigateTo} />

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8b35a]/25 bg-[#f8b35a]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8b35a]">
            <Building size={13} className="text-[#f8b35a]" />
            Enterprise Infrastructure
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Enterprise-grade SQL intelligence.
          </h1>
          <p className="mt-6 text-base text-stone-300 sm:text-lg leading-relaxed">
            Run sql Agent inside your secure virtual private cloud. Retain full custody of database 
            schemas, queries, and execution paths under strict compliance standards.
          </p>
        </section>

        {/* Pillars / Enterprise Features grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-20">
          {[
            {
              icon: <ShieldCheck className="text-[#f8b35a]" size={22} />,
              title: "SOC 2 & GDPR Compliance",
              desc: "Engineered from day one with data privacy principles. Full row-level encryption, schema masking, and audit records."
            },
            {
              icon: <Server className="text-[#f8b35a]" size={22} />,
              title: "Private VPC / On-Premises",
              desc: "Deploy as a secure containerized pod inside AWS, Azure, or GCP. Keep all database requests within internal routers."
            },
            {
              icon: <Key className="text-[#f8b35a]" size={22} />,
              title: "SAML & SSO Integrations",
              desc: "Provision team seats seamlessly using Okta, Entra ID, or customized SAML 2.0 identity directories."
            },
            {
              icon: <Cpu className="text-[#f8b35a]" size={22} />,
              title: "Dedicated Local LLMs",
              desc: "Optional configuration to hook into air-gapped private models (Llama-3, DeepSeek) for analysis without API callbacks."
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-5">
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-white tracking-wide">{item.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-stone-400">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Interactive Arch Configurator & Demo booking form */}
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mb-20">
          
          {/* Left Panel: Architecture Architect */}
          <div className="rounded-3xl border border-white/10 bg-[#11100d]/90 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-white tracking-wide">
              VPC Architecture Configurator
            </h2>
            <p className="mt-1.5 text-xs text-stone-400">
              Customize deployment topologies, SLAs, and security controls to visualize your deployment layout.
            </p>

            {/* Config controls */}
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Deployment Environment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "vpc", label: "Managed VPC" },
                    { id: "k8s", label: "Kubernetes" },
                    { id: "onprem", label: "Air-Gapped" }
                  ].map((dep) => (
                    <button
                      key={dep.id}
                      onClick={() => setDeployment(dep.id)}
                      className={`rounded-xl border py-2.5 text-center text-xs font-semibold transition-all ${
                        deployment === dep.id
                          ? "border-[#f8b35a] bg-[#f8b35a]/5 text-white"
                          : "border-white/5 bg-white/[0.02] text-stone-400 hover:border-white/10"
                      }`}
                    >
                      {dep.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Service Level Agreement (SLA)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "99.9", label: "99.9%" },
                      { id: "99.99", label: "99.99%" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSla(s.id)}
                        className={`rounded-xl border py-2 text-center text-xs font-semibold transition-all ${
                          sla === s.id
                            ? "border-[#f8b35a] bg-[#f8b35a]/5 text-white"
                            : "border-white/5 bg-white/[0.02] text-stone-400 hover:border-white/10"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Enhanced Guardrails
                  </label>
                  <button
                    onClick={() => setSecurityPackage(!securityPackage)}
                    className={`w-full rounded-xl border py-2 text-center text-xs font-semibold transition-all ${
                      securityPackage
                        ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-400"
                        : "border-white/5 bg-white/[0.02] text-stone-400 hover:border-white/10"
                    }`}
                  >
                    {securityPackage ? "Audit Logging Enabled" : "Audit Logging Disabled"}
                  </button>
                </div>
              </div>
            </div>

            {/* Architecture Layout Output */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#0c0a07] p-5">
              <div className="text-xs uppercase tracking-widest text-[#f8b35a] font-semibold mb-3">
                Current Topology Blueprint
              </div>
              <div className="space-y-4 font-mono text-xs leading-relaxed text-stone-300">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-stone-400">Execution Pipeline:</span>
                  <span className="text-white">
                    {deployment === "vpc" && "AWS/GCP Dedicated Tenant Private Link"}
                    {deployment === "k8s" && "Self-Managed Helm / EKS Pods"}
                    {deployment === "onprem" && "Isolated Host (Air-gapped / Local Weights)"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-stone-400">Response Guarantee:</span>
                  <span className="text-white">{estimate.monthlySLA}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-stone-400">Support Pipeline:</span>
                  <span className="text-white">{estimate.supportType}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">Assigned Security Controls:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {estimate.securityFeatures.map((feat, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-stone-200">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Inquiry/Contact Form */}
          <div className="rounded-3xl border border-white/10 bg-[#11100d]/90 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-center">
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                  <FileCheck2 size={28} />
                </div>
                <h3 className="text-xl font-semibold text-white">Inquiry Received</h3>
                <p className="mt-3 text-sm text-stone-400 max-w-sm mx-auto leading-relaxed">
                  Thank you! An Enterprise Database architect will contact you within 2 hours with customized VPC pricing estimates.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 text-xs text-[#f8b35a] hover:underline font-semibold"
                >
                  Configure another blueprint
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <h2 className="text-xl font-semibold text-white tracking-wide">
                  Schedule Architect Review
                </h2>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  Provide your work email and team details. We will prepare configuration charts for your selected architecture type.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-stone-500 focus:border-[#f8b35a] focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="s.jenkins@enterprise.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-stone-500 focus:border-[#f8b35a] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-stone-500 focus:border-[#f8b35a] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                      Additional Requirements
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Special network policies, regional residency restrictions, or database sizing concerns..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-stone-500 focus:border-[#f8b35a] focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-xs font-semibold text-black hover:bg-stone-200 transition-colors disabled:opacity-50"
                  >
                    {formLoading ? "Sending Details..." : "Submit Topology Inquiry"}
                    <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </section>

      </main>
    </div>
  );
}

export default EnterprisePage;
