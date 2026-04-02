import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github } from "lucide-react";

function LoginPage({ onLogin, onNavigateToSignup }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

   const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    onLogin(data.user);
  } else {
    alert(data.message);
  }
};

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#020617] p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl"></div>
                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>

                <div className="relative">
                    <div className="mb-8 text-center text-white">
                        <h1 className="text-4xl font-black tracking-tight font-['Outfit']">Welcome Back</h1>
                        <p className="mt-2 text-slate-400">Continue your data analysis journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-rose-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none ring-offset-slate-950 transition-all focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-200">Password</label>
                                <button type="button" className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-rose-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 py-3.5 pl-12 pr-12 text-white placeholder:text-slate-600 outline-none ring-offset-slate-950 transition-all focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-400 active:scale-[0.98]"
                        >
                            Sign In
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-3 text-slate-500 font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98]">
                            <Github size={20} />
                            GitHub
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <button
                            onClick={onNavigateToSignup}
                            className="font-bold text-rose-500 hover:text-rose-400 transition-colors"
                        >
                            Sign Up For Free
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
