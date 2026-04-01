import React from "react";
import { Maximize2, X } from "lucide-react";

function FullscreenModal({ fullscreenData, setFullscreenData }) {
  if (!fullscreenData) return null;

  const isImage = fullscreenData.type === 'image';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 md:p-10 backdrop-blur-md transition-all duration-300">
      <div className={`relative max-h-full w-full overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col ${isImage ? 'max-w-4xl' : ''}`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 dark:text-white">
            <Maximize2 className="h-5 w-5 text-rose-500" />
            {isImage ? 'Image Preview' : 'Complete Dataset'}
          </h2>
          <button
            onClick={() => setFullscreenData(null)}
            className="group rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 dark:text-slate-400 transition hover:bg-rose-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {isImage ? (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={fullscreenData.url}
                alt="Fullscreen Preview"
                className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          ) : (
            <div className="min-w-full">
              <table className="min-w-full border-collapse text-left text-sm text-slate-800 dark:text-slate-100">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    {Object.keys(fullscreenData[0] || {}).map((k) => (
                      <th
                        key={k}
                        className="border-b border-slate-300 dark:border-slate-700 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
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
                      className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      {Object.values(row).map((v, j) => (
                        <td
                          key={j}
                          className="border-r border-slate-200/10 dark:border-slate-800/10 px-4 py-3 font-mono text-xs whitespace-pre-wrap"
                        >
                          {typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)}
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
