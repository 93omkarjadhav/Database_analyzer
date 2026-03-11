import React from "react";
import { Maximize2 } from "lucide-react";

function FullscreenModal({ fullscreenData, setFullscreenData }) {
  if (!fullscreenData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-10 backdrop-blur-sm">
      <div className="max-h-full w-full overflow-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <Maximize2 className="h-5 w-5 text-rose-400" /> Complete Dataset
          </h2>
          <button
            onClick={() => setFullscreenData(null)}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-rose-400 transition hover:bg-rose-500 hover:text-white"
          >
            CLOSE [ESC]
          </button>
        </div>
        <table className="min-w-full border-collapse text-left text-sm text-slate-100">
          <thead className="sticky top-0 bg-slate-900">
            <tr className="bg-slate-800">
              {Object.keys(fullscreenData[0] || {}).map((k) => (
                <th
                  key={k}
                  className="border-b border-slate-700 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400"
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
                className="border-b border-slate-800/50 hover:bg-white/5"
              >
                {Object.values(row).map((v, j) => (
                  <td
                    key={j}
                    className="border-r border-slate-800/30 px-4 py-3 font-mono text-xs"
                  >
                    {String(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FullscreenModal;
