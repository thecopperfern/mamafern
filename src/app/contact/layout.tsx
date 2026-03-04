import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the Mama Fern team. Questions about orders, products, sizing, or feedback — we'd love to hear from you.",
  path: "/contact",
  keywords: ["contact mama fern", "customer support", "family apparel help"],
    noIndex: true,
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
