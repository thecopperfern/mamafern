import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Analytics",
  description: "Mama Fern analytics dashboard.",
  path: "/analytics",
  noIndex: true,
});

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
