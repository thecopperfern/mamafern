import { Suspense } from "react";
import { LoginForm } from "./login-form";

/**
 * Keystatic CMS Login Page
 *
 * Suspense boundary is required because LoginForm uses useSearchParams(),
 * which causes a client-side rendering bailout during static generation.
 */
export default function KeystaticLoginPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-charcoal tracking-wide">
            Mama Fern
          </p>
          <p className="text-sm text-warm-brown mt-1 font-body">
            Content Studio
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-sm border border-oat p-8 animate-pulse">
            <div className="h-6 bg-oat rounded w-24 mb-6" />
            <div className="h-10 bg-oat rounded mb-4" />
            <div className="h-10 bg-oat rounded" />
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-warm-brown/60 mt-6">
          Need access? Contact the site admin.
        </p>
      </div>
    </main>
  );
}
