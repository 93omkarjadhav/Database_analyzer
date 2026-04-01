import React from "react";
import { Sun, Moon } from "lucide-react";

import ProfileMenu from "./ProfileMenu";

function Header({ activeChat, isDarkMode, toggleTheme, onLogout }) {
  return (
    <div className="border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-start">
      <div>
        <h1 className="flex items-center gap-3 font-['Outfit'] select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 font-black text-white shadow-lg shadow-rose-500/20">
            SQL
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-rose-600 dark:from-white dark:via-slate-200 dark:to-rose-500 bg-clip-text text-transparent">
              Sql Agent
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
              Intelligence Multi-Storage
            </span>
          </div>
        </h1>
        {activeChat.source === "BigQuery" && (
          <div className="mt-3 inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            Analytical Mode:{" "}
            <span className="ml-1 font-medium italic">Google BigQuery Warehouse</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ProfileMenu onLogout={onLogout} />

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm active:scale-95"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}

export default Header;
