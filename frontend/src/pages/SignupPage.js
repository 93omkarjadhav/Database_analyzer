import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

function SignupPage({ onSignup, onNavigateToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      onSignup(data.user);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#020617] p-4 py-6 sm:p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-8 text-center text-white">
            <h1 className="font-['Outfit'] text-3xl font-black tracking-tight sm:text-4xl">Create Account</h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">Join the next generation of data analysis</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Full Name</label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 transition-colors group-focus-within:text-rose-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 py-3 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Email Address</label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 transition-colors group-focus-within:text-rose-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@company.com"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 py-3 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 transition-colors group-focus-within:text-rose-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 py-3 pl-12 pr-12 text-white outline-none transition-all placeholder:text-slate-600 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 transition-colors hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-950 text-rose-500 focus:ring-rose-500/20" required />
              <p className="text-xs leading-5 text-slate-500">
                I agree to the <button className="text-rose-500 hover:underline">Terms of Service</button> and <button className="text-rose-500 hover:underline">Privacy Policy</button>
              </p>
            </div>

            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-400 active:scale-[0.98]"
            >
              Sign Up
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="font-bold text-rose-500 transition-colors hover:text-rose-400"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
