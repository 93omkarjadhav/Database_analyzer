import React from "react";

function Header({ activeChat }) {
  return (
    <div className="border-b border-slate-800 px-6 py-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        🤖 Retail AI: Multi-DB & Files
      </h1>
      {activeChat.source === "BigQuery" && (
        <div className="mt-3 inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200">
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
          Analytical Mode:{" "}
          <span className="ml-1 font-medium italic">Google BigQuery Warehouse</span>
        </div>
      )}
    </div>
  );
}

export default Header;
