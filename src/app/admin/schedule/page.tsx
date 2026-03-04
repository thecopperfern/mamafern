import { getScheduledContent } from "@/lib/content-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  announcement: { bg: "bg-terracotta/10", text: "text-terracotta", label: "Announcement" },
  campaign: { bg: "bg-fern/10", text: "text-fern", label: "Campaign" },
  blog: { bg: "bg-sage/20", text: "text-sage", label: "Blog Post" },
};

export default async function SchedulePage() {
  const items = await getScheduledContent();
  const now = new Date();

  const upcoming = items.filter((i) => new Date(i.date) > now);
  const past = items.filter((i) => new Date(i.date) <= now).reverse();
  const nextUp = upcoming[0];

  // Items in next 24h and 7 days
  const next24h = upcoming.filter(
    (i) => new Date(i.date).getTime() - now.getTime() < 24 * 60 * 60 * 1000
  );
  const next7d = upcoming.filter(
    (i) => new Date(i.date).getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
  );

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-charcoal mb-6">
        Content Schedule
      </h1>

      {/* Next Up Banner */}
      {nextUp && (
        <div className="mb-8 rounded-xl border-2 border-fern/30 bg-fern/5 p-6">
          <p className="text-xs font-medium text-fern uppercase tracking-wider mb-1">
            Next Up
          </p>
          <p className="font-display font-bold text-lg text-charcoal">
            {nextUp.label}
          </p>
          <p className="text-sm text-warm-brown">
            {nextUp.action} on{" "}
            {new Date(nextUp.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <Link
            href={nextUp.editUrl}
            className="text-sm text-fern hover:underline mt-2 inline-block"
          >
            Edit in CMS &rarr;
          </Link>
        </div>
      )}

      {/* Warnings */}
      {next24h.length > 0 && (
        <div className="mb-4 rounded-lg bg-terracotta/10 border border-terracotta/20 px-4 py-3">
          <p className="text-sm font-medium text-terracotta">
            {next24h.length} item{next24h.length > 1 ? "s" : ""} scheduled in the next 24 hours
          </p>
        </div>
      )}
      {next7d.length > next24h.length && (
        <div className="mb-6 rounded-lg bg-sage/10 border border-sage/20 px-4 py-3">
          <p className="text-sm font-medium text-charcoal/70">
            {next7d.length} item{next7d.length > 1 ? "s" : ""} scheduled in the next 7 days
          </p>
        </div>
      )}

      {/* Upcoming */}
      <h2 className="font-display font-bold text-lg text-charcoal mb-4">Upcoming</h2>
      {upcoming.length === 0 ? (
        <p className="text-warm-brown text-sm mb-8">No scheduled content changes.</p>
      ) : (
        <div className="space-y-3 mb-10">
          {upcoming.map((item, i) => {
            const style = TYPE_STYLES[item.type] || TYPE_STYLES.blog;
            return (
              <div
                key={`${item.date}-${item.label}-${i}`}
                className="flex items-center gap-4 rounded-lg border border-oat p-4"
              >
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{item.label}</p>
                  <p className="text-xs text-warm-brown">
                    {item.action} —{" "}
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Link
                  href={item.editUrl}
                  className="text-xs text-fern hover:underline shrink-0"
                >
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Past */}
      {past.length > 0 && (
        <>
          <h2 className="font-display font-bold text-lg text-charcoal mb-4">Recent</h2>
          <div className="space-y-3 opacity-60">
            {past.slice(0, 10).map((item, i) => {
              const style = TYPE_STYLES[item.type] || TYPE_STYLES.blog;
              return (
                <div
                  key={`past-${item.date}-${i}`}
                  className="flex items-center gap-4 rounded-lg border border-oat/60 p-4"
                >
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal/70 truncate">{item.label}</p>
                    <p className="text-xs text-warm-brown">
                      {item.action} —{" "}
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
