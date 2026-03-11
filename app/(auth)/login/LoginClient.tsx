"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth-service";

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
    <form
      onSubmit={handleLogin}
      className="w-87.5 space-y-4 rounded-xl bg-zinc-800 p-6"
    >
      <h1 className="text-center text-2xl font-bold text-white">Login</h1>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full rounded bg-zinc-700 p-2 text-white outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded bg-zinc-700 p-2 text-white outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};

export default LoginClient;