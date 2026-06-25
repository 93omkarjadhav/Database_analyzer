import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Check, ArrowRight, HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Do you store or see my actual database passwords?",
    answer: "No. sql Agent stores connection parameters locally in your browser workspace if using the cloud version, or strictly inside your own VPC containers if using the Enterprise setup. Database credentials never cross our servers."
  },
  {
    question: "How does the AI auto-fix query system work?",
    answer: "Our engine reviews query schemas and parses syntax trees using our local parser. When errors or index-misses occur, it prompts our specialized code intelligence models with syntax rules and generates optimized code. You can review the exact diff before running it."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Absolutely. You can cancel, upgrade, or downgrade your plan directly from your billing workspace tab. Changes apply instantly and any remaining balance is credited proportionally."
  },
  {
    question: "Do you support databases other than MySQL?",
    answer: "Currently, our optimized auto-fixing and index analyzer supports PostgreSQL and MySQL databases. We are adding MS SQL Server and Snowflake analytics in early Q3."
  }
];

function PricingPage({ navigateTo }) {
  const [billingCycle, setBillingCycle] = useState("annual"); // annual or monthly
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    document.title = "Simple, Transparent Pricing | sql Agent";
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.name = "description";
    meta.content = "Compare sql Agent plans. Find the perfect fit for individuals, engineering teams, and compliant enterprises. Start optimizing SQL for free.";
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getPrice = (monthlyPrice, annualPrice) => {
    return billingCycle === "annual" ? annualPrice : monthlyPrice;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0906] text-stone-50">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,179,90,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_32%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] pointer-events-none" />

      <Navbar currentPath="/pricing" navigateTo={navigateTo} />

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        
        {/* Header Title */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8b35a]/25 bg-[#f8b35a]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8b35a]">
            Pricing Plans
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Simple, transparent pricing.
          </h1>
          <p className="mt-5 text-stone-400 text-sm sm:text-base">
            No credit card required to start. Cancel or adjust tiers at any time.
          </p>

          {/* Toggle Switch */}
          <div className="mt-8 flex justify-center">
            <div className="relative flex rounded-full bg-white/[0.04] border border-white/10 p-1">
              <button
                id="btn-billing-monthly"
                onClick={() => setBillingCycle("monthly")}
                className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  billingCycle === "monthly" ? "text-black" : "text-stone-300"
                }`}
              >
                Monthly billing
              </button>
              <button
                id="btn-billing-annual"
                onClick={() => setBillingCycle("annual")}
                className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  billingCycle === "annual" ? "text-black" : "text-stone-300"
                }`}
              >
                Yearly billing (Save 20%)
              </button>

              {/* Slider Highlight */}
              <div 
                className={`absolute top-1 bottom-1 rounded-full bg-white transition-all duration-350 ease-out-quad ${
                  billingCycle === "monthly" 
                    ? "left-1 w-[116px]" 
                    : "left-[122px] w-[156px]"
                }`}
              />
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid gap-6 md:grid-cols-3 mb-20 items-stretch">
          
          {/* Starter Plan */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-white/[0.01] p-8 hover:border-white/10 transition-all">
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Starter</div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="ml-1 text-xs text-stone-400">/ forever</span>
              </div>
              <p className="mt-4 text-xs text-stone-400 leading-relaxed">
                Great for freelance developers and students testing database configurations.
              </p>

              <ul className="mt-8 space-y-3.5 text-xs text-stone-300">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>1 Active session</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>50 query evaluations/mo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>CSV and JSON result exports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>Priority email support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigateTo("/signup")}
              className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition-all"
            >
              Sign up free
            </button>
          </div>

          {/* Pro Plan (Recommended) */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#f8b35a] bg-[#11100d]/90 p-8 shadow-[0_15px_40px_rgba(248,179,90,0.06)] scale-100 sm:scale-[1.03] transition-all">
            <span className="absolute -top-3.5 right-6 rounded-full bg-[#f8b35a] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
              Recommended
            </span>
            <div>
              <div className="text-xs uppercase tracking-widest text-[#f8b35a] font-black">Pro</div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">${getPrice(59, 49)}</span>
                <span className="ml-1 text-xs text-stone-400">/ month</span>
              </div>
              <p className="mt-4 text-xs text-stone-300 leading-relaxed">
                Best for database teams requiring real-time query optimization and local schema index caching.
              </p>

              <ul className="mt-8 space-y-3.5 text-xs text-stone-200 font-medium">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>Unlimited active sessions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>2,000 query evaluations/mo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span><strong>AI Auto-fixing</strong> query pipeline</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>Schema-level indexing recommendations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>Excel and custom text exports</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigateTo("/signup")}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs font-bold text-black hover:bg-stone-200 transition-all"
            >
              Get started now
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-white/[0.01] p-8 hover:border-white/10 transition-all">
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Enterprise</div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">Custom</span>
                <span className="ml-1 text-xs text-stone-400">/ annually</span>
              </div>
              <p className="mt-4 text-xs text-stone-400 leading-relaxed">
                For organizations that require absolute security, VPC deployments, and local model engines.
              </p>

              <ul className="mt-8 space-y-3.5 text-xs text-stone-300">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>Everything in Pro tier</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>Self-hosted VPC containers (K8s/Docker)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>Dedicated custom LLMs integration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>SAML SSO and detailed audit trails</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#f8b35a] shrink-0" />
                  <span>99.99% critical response SLA</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigateTo("/enterprise")}
              className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition-all"
            >
              Contact Sales
            </button>
          </div>

        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center text-white tracking-wide mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/5 bg-[#11100d]/50 overflow-hidden"
                >
                  <button
                    id={`faq-btn-${index}`}
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={15} className="text-[#f8b35a]" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform duration-250 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-40 border-t border-white/5" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-xs text-stone-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}

export default PricingPage;
