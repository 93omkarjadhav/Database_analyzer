import React from "react";
import { Maximize2, X } from "lucide-react";

function FullscreenModal({ fullscreenData, setFullscreenData }) {
  if (!fullscreenData) return null;

  const isImage = fullscreenData.type === "image";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-md transition-all duration-300 md:p-10">
      <div
        className={`relative flex max-h-[90vh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 ${
          isImage ? "md:max-w-4xl" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-800 dark:text-white md:text-lg">
            <Maximize2 className="h-5 w-5 text-rose-500" />
            {isImage ? "Image Preview" : "Complete Dataset"}
          </h2>
          <button
            onClick={() => setFullscreenData(null)}
            className="group rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-rose-500 hover:text-white dark:bg-slate-800 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-3 md:p-6">
          {isImage ? (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={fullscreenData.url}
                alt="Fullscreen Preview"
                className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-[640px] border-collapse text-left text-sm text-slate-800 dark:text-slate-100">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    {Object.keys(fullscreenData[0] || {}).map((k) => (
                      <th
                        key={k}
                        className="border-b border-slate-300 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:text-slate-400"
                      >
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fullscreenData.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-200/50 transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-white/5"
                    >
                      {Object.values(row).map((v, j) => (
                        <td
                          key={j}
                          className="border-r border-slate-200/10 px-4 py-3 font-mono text-xs whitespace-pre-wrap dark:border-slate-800/10"
                        >
                          {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FullscreenModal;
