"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/view/Auth/Login";
import SignupForm from "@/components/view/Auth/Signup";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)customerAccessToken=([^;]*)/
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  // If already logged in, redirect to account
  useEffect(() => {
    if (getTokenFromCookie()) {
      router.replace("/account");
    }
  }, [router]);

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-heading text-3xl text-center mb-2">
        {showRegister ? "Create Account" : "Welcome Back"}
      </h1>
      <p className="text-center text-warm-brown mb-6">
        {showRegister
          ? "Join the Mama Fern family"
          : "Log in to your Mama Fern account"}
      </p>
      {showRegister ? (
        <SignupForm setShowRegister={setShowRegister} />
      ) : (
        <Login setShowRegister={setShowRegister} />
      )}
    </main>
  );
}
