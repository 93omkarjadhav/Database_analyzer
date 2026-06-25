import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

function Navbar({ currentPath, navigateTo }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (path) => {
    navigateTo(path);
    setIsOpen(false);
  };

  const navItems = [
    { name: "Product", path: "/product" },
    { name: "Enterprise", path: "/enterprise" },
    { name: "Pricing", path: "/pricing" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <header className="relative z-50 w-full border-b border-white/[0.06] bg-[#0b0906]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        {/* Brand logo */}
        <button
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-3 text-left focus:outline-none"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-[11px] font-black tracking-[0.28em] text-white shadow-lg shadow-black/20">
            SA
          </span>
          <div>
            <span className="block text-sm font-semibold tracking-[0.22em] uppercase text-white">
              sql Agent
            </span>
            <span className="block text-[10px] text-stone-400 sm:text-xs">
              Database intelligence dashboard
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`relative py-1 transition-colors hover:text-white ${
                  isActive ? "text-[#f8b35a]" : "text-stone-300"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#f8b35a]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => navigateTo("/login")}
            className="rounded-full px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:text-white"
          >
            Sign in
          </button>
          <button
            onClick={() => navigateTo("/signup")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#f3efe8] px-4 py-2 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Get started
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-white/10 p-2 text-stone-300 hover:text-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute left-0 top-full z-40 w-full border-b border-white/[0.08] bg-[#0b0906] p-6 shadow-2xl transition-all duration-300 ease-in-out lg:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-left text-base font-medium py-2 transition-colors border-b border-white/[0.03] ${
                    isActive ? "text-[#f8b35a]" : "text-stone-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick("/login")}
                className="w-full rounded-full border border-white/10 py-3 text-center text-sm font-semibold text-stone-200 hover:bg-white/5"
              >
                Sign in
              </button>
              <button
                onClick={() => handleNavClick("/signup")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f3efe8] py-3 text-center text-sm font-bold text-black"
              >
                Get started
                <ArrowRight size={14} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
