import React from "react";
import { Database } from "lucide-react";

const DATA_SOURCES = [
  "MySQL Database",
  "PostgreSQL",
  "Oracle",
  "MongoDB",
  "SQLite",
  "BigQuery",
  "Upload File",
];

function DataSourceSelector({ activeChat, updateSource }) {
  return (
    <div>
      <div className="mb-2 flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        <Database className="mr-1 h-3 w-3" /> Data Source
      </div>
      <div className="space-y-1">
        {DATA_SOURCES.map((src) => (
          <label
            key={src}
            className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-xs hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
          >
            <input
              type="radio"
              checked={activeChat.source === src}
              onChange={() => updateSource(src)}
              className="mr-2 h-3 w-3 accent-rose-500"
            />
            <span>{src}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default DataSourceSelector;
