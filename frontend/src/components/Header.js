import React from "react";
import { Sun, Moon } from "lucide-react";

import ProfileMenu from "./ProfileMenu";

function Header({ activeChat, isDarkMode, toggleTheme, onLogout, user }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-4">
      <div className="min-w-0 flex-1">
        <h1 className="flex items-center gap-3 font-['Outfit'] select-none">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 font-black text-white shadow-lg shadow-rose-500/20 md:h-10 md:w-10">
            SQL
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate bg-gradient-to-r from-slate-900 via-slate-800 to-rose-600 bg-clip-text text-lg font-black leading-none tracking-tight text-transparent dark:from-white dark:via-slate-200 dark:to-rose-500 sm:text-xl md:text-2xl">
              Sql Agent
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 sm:inline">
              Intelligence Multi-Storage
            </span>
          </div>
        </h1>
        {activeChat?.source === "BigQuery" && (
          <div className="mt-3 inline-flex max-w-full items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-700 dark:text-blue-200">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="truncate">
              Analytical Mode:
              <span className="ml-1 font-medium italic">Google BigQuery Warehouse</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
        <ProfileMenu onLogout={onLogout} user={user} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <button
          onClick={toggleTheme}
          className="rounded-full bg-slate-100 p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}

export default Header;
