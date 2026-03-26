"use client";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
    </div>
  );
}
