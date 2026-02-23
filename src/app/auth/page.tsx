"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Auth feature coming soon - redirect home
    router.replace("/");
  }, [router]);

  return <p>Redirecting...</p>;
}
