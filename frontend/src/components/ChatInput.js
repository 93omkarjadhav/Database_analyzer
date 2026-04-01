import React, { useRef } from "react";
import { Send, Plus, X } from "lucide-react";

function ChatInput({
  input,
  setInput,
  handleSend,
  loading,
  activeChat,
  selectedImages,
  setSelectedImages,
}) {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 dark:from-slate-950 dark:via-slate-950/95 to-transparent pb-6 pt-10">
      <div className="relative mx-auto w-full max-w-4xl px-4">
        <div className="relative flex w-full flex-col">
          {/* Image Previews */}
          {selectedImages && selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-inner max-h-40 overflow-y-auto">
              {selectedImages.map((file, idx) => (
                <div key={idx} className="relative group transition-all duration-200">
                  <div className="h-16 w-16 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm transition hover:ring-rose-500">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-md transform transition active:scale-95 hover:bg-rose-600"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex w-full items-end">
            <div className="relative flex flex-1 items-end">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute left-2 bottom-1.5 group flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-rose-500 shadow-sm border border-slate-300 dark:border-slate-700/50 active:scale-95 z-10"
                title="Add images"
              >
                <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              </button>

              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex max-h-48 w-full resize-none rounded-[32px] border border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/90 py-3 pl-14 pr-[110px] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm transition-all duration-200"
                placeholder={
                  activeChat.source === "BigQuery"
                    ? "Run analytics on BigQuery Warehouse..."
                    : "Analyze your data source..."
                }
              />
              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && selectedImages.length === 0)}
                className="absolute bottom-1.5 right-2 inline-flex h-9 items-center justify-center rounded-full border border-rose-500/60 bg-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-400 disabled:border-slate-300 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 active:scale-95"
              >
                <Send className="mr-2 h-4 w-4" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
