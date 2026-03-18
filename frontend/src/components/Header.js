import React from "react";
import { Sun, Moon } from "lucide-react";

function Header({ activeChat, isDarkMode, toggleTheme }) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3 w-fit">
          {/* <span className="text-4xl filter drop-shadow hover:scale-110 transition-transform cursor-default">🤖</span> */}
          <span className="bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">Sql Agent </span>
          <span className="text-slate-400 dark:text-slate-500 font-light mx-1">|</span>
          <span className="text-2xl font-semibold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">Multi-DB & Files</span>
        </h1>
        {activeChat.source === "BigQuery" && (
          <div className="mt-3 inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            Analytical Mode:{" "}
            <span className="ml-1 font-medium italic">Google BigQuery Warehouse</span>
          </div>
        )}
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 ml-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}

export default Header;
