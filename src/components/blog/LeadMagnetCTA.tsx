"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

/**
 * LeadMagnetCTA — Email-gated PDF download card
 *
 * Flow: Enter email -> POST to /api/lead-magnet -> Brevo contact created
 *       -> download link revealed.
 *
 * Rendered inside blog posts when a leadMagnetSlug is configured.
 */
export default function LeadMagnetCTA({
  title,
  description,
  fileUrl,
  ctaText,
  brevoListId,
  thumbnail,
}: {
  title: string;
  description?: string;
  fileUrl: string;
  ctaText?: string;
  brevoListId?: string;
  thumbnail?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadRevealed, setDownloadRevealed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          leadMagnetTitle: title,
          listId: brevoListId,
          downloadUrl: fileUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setDownloadRevealed(true);
      toast.success("Check your email! Your download is ready below.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 rounded-xl border border-fern/20 bg-fern/5 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {thumbnail && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-oat">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-display font-bold text-lg text-charcoal mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-charcoal/70 mb-3">{description}</p>
          )}

          {downloadRevealed ? (
            <a
              href={fileUrl}
              download
              className="inline-flex items-center gap-2 bg-fern hover:bg-fern-dark text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Now
            </a>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-oat rounded-lg px-3 py-2 text-sm bg-white text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern"
                aria-label="Email address for download"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-fern hover:bg-fern-dark text-white shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-label="Submitting..." />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" aria-hidden="true" />
                    {ctaText || "Get Free Guide"}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
