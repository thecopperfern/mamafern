import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Order History",
  description: "View your Mama Fern order history and tracking details.",
  path: "/account/orders",
  noIndex: true,
});

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
