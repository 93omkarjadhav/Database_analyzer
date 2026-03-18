import React from "react";
import { FileUp } from "lucide-react";

function FileUpload({ activeChat, uploading, handleFileUpload }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-1.5">
          <FileUp className="h-4 w-4 text-rose-400" /> Upload File
        </div>
        {uploading && <span className="text-[10px] text-rose-300">Uploading...</span>}
      </div>
      <label className="flex cursor-pointer items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
        Choose CSV file
      </label>
      {activeChat.fileName && (
        <p className="mt-2 truncate text-[11px] font-medium text-emerald-300">
          Talking with: {activeChat.fileName}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
