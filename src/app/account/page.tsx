"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to auth page - account feature coming soon
    router.replace("/auth");
  }, [router]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p>Redirecting...</p>
    </main>
  );
}
