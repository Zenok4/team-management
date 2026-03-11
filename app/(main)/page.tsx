"use client";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (!loading) {
    console.log(user);
  }
  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
    </div>
  );
}
