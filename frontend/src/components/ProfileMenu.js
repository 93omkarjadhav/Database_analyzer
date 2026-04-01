import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

function ProfileMenu({ onLogout, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const displayName = user?.name || "Guest User";

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        if (onLogout) onLogout();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 pr-3 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-indigo-600 text-white shadow-sm">
                    <User size={18} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:inline-block capitalize">
                    {displayName}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right scale-100 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-all z-[60]">
                    <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Account Management
                    </div>

                    <div className="space-y-1">
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <User size={16} />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">{displayName}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email || "No email provided"}</div>
                            </div>
                        </button>

                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500/10 text-slate-500 dark:text-slate-400">
                                <Settings size={16} />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">Settings</div>
                                <div className="text-[10px] text-slate-400">Preferences & Security</div>
                            </div>
                        </button>
                    </div>

                    <div className="mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                                <LogOut size={16} />
                            </div>
                            <div className="font-semibold text-left underline underline-offset-4 decoration-rose-500/30">Logout</div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
