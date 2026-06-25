import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown, Sun, Moon, Shield } from "lucide-react";

function ProfileMenu({ onLogout, user, isDarkMode, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef(null);

  const displayName =
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Guest User";

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    setShowSettings(false);
    if (onLogout) onLogout();
  };

  const handleSettingsToggle = () => {
    setShowSettings((prev) => !prev);
  };

  const handleThemeToggle = () => {
    if (toggleTheme) toggleTheme();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-indigo-600 text-white shadow-sm">
          <User size={18} />
        </div>
        <span className="hidden text-sm font-medium capitalize text-slate-700 dark:text-slate-200 sm:inline-block">
          {displayName}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[60] mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/50">
          <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Account Management
          </div>

          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <User size={16} />
              </div>
              <div className="min-w-0 text-left">
                <div className="font-semibold">{displayName}</div>
                <div className="max-w-[150px] truncate text-[10px] text-slate-400">{user?.email || "No email provided"}</div>
              </div>
            </button>

            <button
              onClick={handleSettingsToggle}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500/10 text-slate-500 dark:text-slate-400">
                  <Settings size={16} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Settings</div>
                  <div className="text-[10px] text-slate-400">Preferences & Security</div>
                </div>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showSettings ? "rotate-180" : ""}`} />
            </button>

            {showSettings && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-950/60">
                <button
                  onClick={handleThemeToggle}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </div>
                    <div>
                      <div className="font-medium">Theme Mode</div>
                      <div className="text-[10px] text-slate-400">
                        {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {isDarkMode ? "Dark" : "Light"}
                  </span>
                </button>

                <div className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="font-medium">Session Security</div>
                    <div className="text-[10px] text-slate-400">Signed in as {user?.email || displayName}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                <LogOut size={16} />
              </div>
              <div className="text-left font-semibold underline decoration-rose-500/30 underline-offset-4">Logout</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
