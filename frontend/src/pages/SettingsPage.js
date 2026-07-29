import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, User, Lock, ShieldCheck } from "lucide-react";

function SettingsPage({ user, onBack, onSave, isDarkMode, toggleTheme }) {
  const [username, setUsername] = useState(user?.name || user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    setUsername(user?.name || user?.username || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      setNotification("New password and confirmation do not match.");
      return;
    }

    try {
      await onSave({
        name: username,
        email,
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotification("Settings saved successfully.");
    } catch (error) {
      setNotification(error?.message || "Unable to save settings. Please try again.");
    }

    window.setTimeout(() => setNotification(""), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-black/20 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-slate-300 transition hover:bg-slate-800"
              aria-label="Back to app"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">User Settings</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Profile and security</h1>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            <ShieldCheck size={16} />
            {isDarkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Account details</p>
                <p className="mt-1 text-sm text-slate-500">Update your profile and login information.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {user?.role || "Member"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-slate-200">
                    <User size={16} /> Username
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-rose-500"
                    placeholder="johndoe"
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-slate-200">
                    <Mail size={16} /> Email address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-rose-500"
                    placeholder="name@company.com"
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-100">Change password</p>
                    <p className="text-sm text-slate-500">Set a stronger password for extra security.</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">optional</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="space-y-2 text-sm">
                    <span className="text-slate-400">Current password</span>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-rose-500"
                      placeholder="••••••••"
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="text-slate-400">New password</span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-rose-500"
                      placeholder="••••••••"
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="text-slate-400">Confirm password</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-rose-500"
                      placeholder="••••••••"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-3xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsername(user?.name || user?.username || "");
                    setEmail(user?.email || "");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setNotification("");
                  }}
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  Reset changes
                </button>
              </div>

              {notification && (
                <div className="rounded-3xl border border-emerald-600/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {notification}
                </div>
              )}
            </form>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-black/20">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Security checks</p>
              <p className="mt-2 text-sm text-slate-500">Keep account access safe and review your recent settings.</p>

              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-3xl bg-slate-950/60 p-4">
                  <div>
                    <p className="font-semibold text-slate-100">Two-step authentication</p>
                    <p className="text-slate-500">Enable additional verification for sign-in.</p>
                  </div>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">Off</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-950/60 p-4">
                  <div>
                    <p className="font-semibold text-slate-100">Recent login</p>
                    <p className="text-slate-500">No suspicious sign-ins detected.</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">Secure</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-950/60 p-4">
                  <div>
                    <p className="font-semibold text-slate-100">Email verified</p>
                    <p className="text-slate-500">Your email is connected to this account.</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">Verified</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Preferences</p>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-3xl bg-slate-900/70 p-4">
                  <div>
                    <p className="font-semibold text-slate-100">Theme</p>
                    <p className="text-slate-500">Toggle between light and dark mode.</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-800"
                  >
                    {isDarkMode ? "Dark" : "Light"}
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-900/70 p-4">
                  <div>
                    <p className="font-semibold text-slate-100">Notifications</p>
                    <p className="text-slate-500">Manage alerts for query events and updates.</p>
                  </div>
                  <span className="rounded-full bg-slate-700/80 px-3 py-1 text-xs text-slate-200">Off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
