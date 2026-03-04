"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence, scaleIn } from "@/lib/motion";

import type { PopupData } from "@/lib/content-types";

const COOKIE_NAME = "email_capture_shown";

function setDismissedCookie(days: number) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${COOKIE_NAME}=1; expires=${expires.toUTCString()}; path=/`;
}

function hasDismissedCookie() {
  return document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${COOKIE_NAME}=`));
}

type EmailCaptureModalProps = {
  popupSettings?: PopupData;
};

export default function EmailCaptureModal({ popupSettings }: EmailCaptureModalProps) {
  // CMS-driven text with hardcoded fallbacks
  const heading = popupSettings?.heading || "Welcome to Mama Fern";
  const offerText = popupSettings?.offerText || "Join our community and get 10% off your first order";
  const buttonText = popupSettings?.buttonText || "Get 10% Off";
  const disclaimer = popupSettings?.disclaimer || "By subscribing, you agree to receive marketing emails. Unsubscribe anytime.";
  const exitHeading = popupSettings?.exitIntentHeading || "Your 10% off is about to leaf!";
  const exitBody = popupSettings?.exitIntentBody || "This offer is only for new friends of the fern family. Sure you want to go?";
  const exitStayButton = popupSettings?.exitIntentStayButton || "Keep My 10% Off";
  const exitLeaveText = popupSettings?.exitIntentLeaveText || "No thanks, I'll pay full price";
  const delayMs = popupSettings?.delayMs ?? 8000;
  const cookieExpiryDays = popupSettings?.cookieExpiryDays ?? 30;
  const popupEnabled = popupSettings?.enabled ?? true;
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** When true, shows the "are you sure?" confirmation screen */
  const [confirmingClose, setConfirmingClose] = useState(false);
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
    // If popup is disabled via CMS, don't show
    if (!popupEnabled) return;

    const timer = setTimeout(openOnce, delayMs);

    // Exit-intent: mouse leaves the top of the viewport
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) openOnce();
    }

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [popupEnabled, delayMs]);

  /** First dismiss attempt — show confirmation instead */
  const handleAttemptClose = () => {
    if (confirmingClose) {
      // Already on confirmation screen — actually dismiss
      handleDismiss();
    } else {
      setConfirmingClose(true);
    }
  };

  /** Go back from confirmation to the signup form */
  const handleStay = () => {
    setConfirmingClose(false);
  };

  /** Actually close and set cookie */
  const handleDismiss = () => {
    dismissedRef.current = true;
    setIsOpen(false);
    setConfirmingClose(false);
    setDismissedCookie(cookieExpiryDays);
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
        dismissedRef.current = true;
        setIsOpen(false);
        setDismissedCookie(cookieExpiryDays);
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

  /** Debug: clear the dismissed cookie and re-open the modal */
  const handleDebugOpen = () => {
    // Wipe the cookie so the modal behaves like a first visit
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    dismissedRef.current = false;
    setConfirmingClose(false);
    setEmail("");
    setIsOpen(true);
  };

  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      {/* Debug trigger — dev only, bottom-left corner */}
      {isDev && !isOpen && (
        <button
          onClick={handleDebugOpen}
          className="fixed bottom-4 left-4 z-40 bg-fern text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg hover:bg-fern-dark transition-colors"
        >
          Test Popup
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-charcoal/60 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleAttemptClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-cream rounded-lg shadow-2xl max-w-md w-full p-8 relative pointer-events-auto"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.2 },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleAttemptClose}
                className="absolute top-4 right-4 text-warm-brown hover:text-charcoal transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <AnimatePresence mode="wait">
                {!confirmingClose ? (
                  /* ── Signup form (default state) ── */
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display font-bold text-charcoal mb-2">
                        {heading}
                      </h2>
                      <p className="text-sm text-charcoal/85">
                        {offerText}
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
                        {isSubmitting ? "Subscribing..." : buttonText}
                      </Button>
                    </form>

                    <p className="text-xs text-charcoal/80 text-center mt-4">
                      {disclaimer}
                    </p>
                  </motion.div>
                ) : (
                  /* ── "Are you sure?" confirmation state ── */
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.15 }}
                    className="text-center"
                  >
                    {/* Decorative leaf cluster */}
                    <div className="flex justify-center mb-4" aria-hidden="true">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path
                          d="M24 4C24 4 14 16 14 28C14 33.5 18.5 38 24 38C29.5 38 34 33.5 34 28C34 16 24 4 24 4Z"
                          fill="#4A7C59"
                          opacity="0.2"
                        />
                        <path
                          d="M24 12C24 12 18 20 18 28C18 31.3 20.7 34 24 34C27.3 34 30 31.3 30 28C30 20 24 12 24 12Z"
                          fill="#4A7C59"
                          opacity="0.5"
                        />
                        <path d="M24 16V32" stroke="#4A7C59" strokeWidth="1" opacity="0.4" />
                      </svg>
                    </div>

                    <h2 className="text-xl font-display font-bold text-charcoal mb-2">
                      {exitHeading}
                    </h2>
                    <p className="text-sm text-charcoal/80 mb-6">
                      {exitBody}
                    </p>

                    <div className="space-y-3">
                      <Button
                        onClick={handleStay}
                        className="w-full bg-fern hover:bg-fern-dark text-white"
                      >
                        {exitStayButton}
                      </Button>
                      <button
                        onClick={handleDismiss}
                        className="w-full text-sm text-warm-brown hover:text-charcoal transition-colors py-2"
                      >
                        {exitLeaveText}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
