"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth-service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle, Layers, Quote } from "lucide-react";

const LoginClient = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await authService.login(email, password);

      if (!user) throw new Error("Login failed");

      router.push("/");
    } catch (err: any) {
      setError("Sai email hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* ── LEFT PANEL — hero image ── */}
      <div className="relative hidden w-1/2 flex-col lg:flex overflow-hidden">
        {/* Background image via unsplash */}
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"
          alt="Login background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0f0c29]/80 via-[#302b63]/60 to-[#24243e]/80" />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Content over image */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Layers className="h-4 w-4 text-white" strokeWidth={1.75} />
            </div>
            <span className="text-base font-semibold text-white tracking-tight">
              Team Manager
            </span>
          </div>

          {/* Quote at bottom */}
          <div className="space-y-4">
            <Quote className="h-8 w-8 text-white/30" />
            <blockquote className="text-xl font-light leading-relaxed text-white/90">
              Quản lý đội ngũ hiệu quả — bắt đầu ngay hôm nay.
            </blockquote>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — login form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-[#09090b] px-6 lg:w-1/2 lg:px-16">
        {/* Mobile-only logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <Layers className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <span className="text-base font-semibold text-white">
            Acme Studio
          </span>
        </div>

        <div className="animated-border relative w-full p-10 rounded-md">
          {/* Heading */}
          <div className="space-y-2 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Đăng nhập
            </h1>
            <p className="text-sm text-zinc-500">
              Nhập thông tin tài khoản của bạn để tiếp tục
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <Alert className="border-red-500/25 bg-red-500/10 text-red-400 [&>svg]:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-zinc-300"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/70 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Mật khẩu
                </Label>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/70 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 font-semibold text-white active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
