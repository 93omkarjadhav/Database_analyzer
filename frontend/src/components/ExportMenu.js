import React from "react";
import { Download, Maximize2 } from "lucide-react";

function ExportMenu({
  index,
  message,
  exportMenu,
  setExportMenu,
  openFullscreen,
  exportCSV,
  exportExcel,
  exportJSON,
  exportText,
}) {
  return (
    <div className="absolute right-2 top-2 flex gap-2">
      <button
        onClick={() => setExportMenu(exportMenu === index ? null : index)}
        className="rounded bg-slate-100 dark:bg-slate-800 p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <Download className="h-3 w-3 text-slate-600 dark:text-slate-300" />
      </button>

      {exportMenu === index && (
        <div className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
          <button
            onClick={() => exportCSV(message.dataframe)}
            className="block w-full border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            CSV
          </button>
          <button
            onClick={() => exportExcel(message.dataframe)}
            className="block w-full border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            EXCEL
          </button>
          <button
            onClick={() => exportJSON(message.dataframe || message.jsonData)}
            className="block w-full border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            JSON
          </button>
          <button
            onClick={() => exportText(message.content || message.summary)}
            className="block w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            TEXT
          </button>
        </div>
      )}

      {message.dataframe && (
        <button
          onClick={() => openFullscreen(message.dataframe)}
          className="rounded bg-slate-100 dark:bg-slate-800 p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <Maximize2 className="h-3 w-3 text-slate-600 dark:text-slate-300" />
        </button>
      )}
    </div>
  );
}

export default ExportMenu;
