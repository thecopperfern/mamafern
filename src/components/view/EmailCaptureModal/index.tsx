"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

const COOKIE_NAME = "email_capture_shown";
const COOKIE_EXPIRY_DAYS = 30;
const SHOW_DELAY_MS = 8000; // 8 seconds

function setDismissedCookie() {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
  document.cookie = `${COOKIE_NAME}=1; expires=${expires.toUTCString()}; path=/`;
}

function hasDismissedCookie() {
  return document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${COOKIE_NAME}=`));
}

export default function EmailCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Ref so event listeners always see the latest dismissed state
  const dismissedRef = useRef(false);

  useEffect(() => {
    // Already dismissed in a previous session
    if (hasDismissedCookie()) return;

    function openOnce() {
      if (dismissedRef.current) return;
      setIsOpen(true);
    }

    // Show after delay
    const timer = setTimeout(openOnce, SHOW_DELAY_MS);

    // Exit-intent: mouse leaves the top of the viewport
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) openOnce();
    }

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    dismissedRef.current = true;
    setIsOpen(false);
    setDismissedCookie();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        toast.success("Welcome! Check your email for 10% off");
        handleClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to subscribe");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 z-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-cream rounded-lg shadow-2xl max-w-md w-full p-8 relative pointer-events-auto animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-warm-brown/70 hover:text-charcoal transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-charcoal mb-2">
              Welcome to Mama Fern
            </h2>
            <p className="text-sm text-warm-brown/70">
              Join our community and get <span className="font-semibold text-fern">10% off</span> your first order
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-capture" className="sr-only">
                Email address
              </label>
              <Input
                id="email-capture"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-fern hover:bg-fern-dark text-white"
            >
              {isSubmitting ? "Subscribing..." : "Get 10% Off"}
            </Button>
          </form>

          <p className="text-xs text-warm-brown/70 text-center mt-4">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </>
  );
}
