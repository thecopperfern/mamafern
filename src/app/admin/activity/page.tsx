"use client";

import { useEffect, useState } from "react";

type ActivityItem = {
  sha: string;
  message: string;
  author: string;
  date: string;
};

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content-activity")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else setError(data.error || "Unexpected response");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-charcoal mb-6">
        Content Activity
      </h1>
      <p className="text-sm text-warm-brown mb-6">
        Recent changes to content files (from GitHub commit history).
      </p>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-oat/30 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-terracotta/10 border border-terracotta/20 px-4 py-3">
          <p className="text-sm text-terracotta">{error}</p>
          <p className="text-xs text-warm-brown mt-1">
            This may require a GITHUB_TOKEN env var for API access.
          </p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-warm-brown text-sm">No recent content changes found.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.sha}
              className="flex items-start gap-4 rounded-lg border border-oat p-4"
            >
              <code className="text-xs font-mono text-fern bg-fern/10 px-2 py-1 rounded shrink-0">
                {item.sha}
              </code>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal truncate">{item.message}</p>
                <p className="text-xs text-warm-brown mt-0.5">
                  {item.author} &middot;{" "}
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
