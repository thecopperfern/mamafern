/**
 * Content Types & Defaults
 *
 * TypeScript types for all CMS-driven content, plus hardcoded default values.
 * Every CMS component falls back to these defaults if the Keystatic read fails
 * or returns null — ensuring the site never renders blank sections.
 */

// ─── Navigation ──────────────────────────────────────────────────────────────

export type NavLink = { label: string; href: string };

export type NavigationData = {
  mainLinks: readonly NavLink[];
  infoLinks: readonly NavLink[];
};

export const DEFAULT_NAVIGATION: NavigationData = {
  mainLinks: [
    { label: "Journal", href: "/blog" },
    { label: "Shop", href: "/shop" },
    { label: "Moms", href: "/collections/moms" },
    { label: "Dads", href: "/collections/dads" },
    { label: "Kids", href: "/collections/kids" },
    { label: "Accessories", href: "/collections/accessories" },
  ],
  infoLinks: [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Community", href: "/community" },
    { label: "Contact", href: "/contact" },
    { label: "Journal", href: "/blog" },
  ],
};

// ─── Footer ──────────────────────────────────────────────────────────────────

export type FooterData = {
  brandDescription: string;
  shopLinks: readonly NavLink[];
  infoLinks: readonly NavLink[];
  legalLinks: readonly NavLink[];
  newsletterHeading: string;
  newsletterSubtitle: string;
};

export const DEFAULT_FOOTER: FooterData = {
  brandDescription:
    "Grounded family apparel for crunchy, cozy homes. Cute patterns and sayings in skin-friendly fabrics.",
  shopLinks: [
    { label: "All Collections", href: "/shop" },
    { label: "Moms", href: "/collections/moms" },
    { label: "Dads", href: "/collections/dads" },
    { label: "Kids", href: "/collections/kids" },
    { label: "Accessories", href: "/collections/accessories" },
  ],
  infoLinks: [
    { label: "About", href: "/about" },
    { label: "Journal", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Community", href: "/community" },
    { label: "Contact", href: "/contact" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Returns & Refunds", href: "/returns" },
  ],
  newsletterHeading: "Stay in the Loop",
  newsletterSubtitle:
    "Get deals, new arrivals, and family inspo straight to your inbox.",
};

// ─── Announcement Bar ────────────────────────────────────────────────────────

export type AnnouncementData = {
  enabled: boolean;
  message: string;
  linkText: string;
  linkHref: string;
  backgroundColor: "fern" | "sage" | "terracotta" | "charcoal";
  scheduledFrom: string | null;
  scheduledUntil: string | null;
};

// ─── Popup / Email Capture ───────────────────────────────────────────────────

export type PopupData = {
  enabled: boolean;
  heading: string;
  offerText: string;
  buttonText: string;
  disclaimer: string;
  exitIntentHeading: string;
  exitIntentBody: string;
  exitIntentStayButton: string;
  exitIntentLeaveText: string;
  delayMs: number;
  cookieExpiryDays: number;
};

export const DEFAULT_POPUP: PopupData = {
  enabled: true,
  heading: "Welcome to Mama Fern",
  offerText: "Join our community and get 10% off your first order",
  buttonText: "Get 10% Off",
  disclaimer:
    "By subscribing, you agree to receive marketing emails. Unsubscribe anytime.",
  exitIntentHeading: "Your 10% off is about to leaf!",
  exitIntentBody:
    "This offer is only for new friends of the fern family. Sure you want to go?",
  exitIntentStayButton: "Keep My 10% Off",
  exitIntentLeaveText: "No thanks, I'll pay full price",
  delayMs: 8000,
  cookieExpiryDays: 30,
};

// ─── Shop Page ───────────────────────────────────────────────────────────────

export type ShopPageData = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
};

export const DEFAULT_SHOP_PAGE: ShopPageData = {
  heroEyebrow: "All Collections",
  heroTitle: "Shop All",
  heroSubtitle:
    "Family apparel in skin-friendly fabrics for every stage of growing together.",
};

// ─── Contact Page ────────────────────────────────────────────────────────────

export type ContactInfoItem = {
  emoji: string;
  title: string;
  description: string;
};

export type ContactPageData = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  contactInfoHeading: string;
  contactInfoItems: readonly ContactInfoItem[];
  responseTimeLabel: string;
  responseTimeText: string;
};

export const DEFAULT_CONTACT_PAGE: ContactPageData = {
  heroEyebrow: "Say Hello",
  heroTitle: "Get in Touch",
  heroSubtitle:
    "Have a question or feedback? We'd love to hear from you.",
  contactInfoHeading: "How we can help",
  contactInfoItems: [
    {
      emoji: "📦",
      title: "Order Questions",
      description:
        "Tracking, returns, exchanges — we're here to help with any order issues.",
    },
    {
      emoji: "🌿",
      title: "Product Info",
      description:
        "Sizing, materials, care — ask us anything about our clothing.",
    },
    {
      emoji: "💬",
      title: "General Feedback",
      description:
        "We love hearing from our community. Share your thoughts!",
    },
  ],
  responseTimeLabel: "Response Time",
  responseTimeText:
    "We typically respond within 1–2 business days.",
};

// ─── Homepage Sections ───────────────────────────────────────────────────────

export type CategoryCard = {
  label: string;
  href: string;
  colorClass: string;
};

export type FeaturedSection = {
  collectionHandle: string;
  title: string;
  subtitle: string;
};

export type HomepageSectionsData = {
  categoryCardsHeading: string;
  categories: readonly CategoryCard[];
  featuredSections: readonly FeaturedSection[];
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionsData = {
  categoryCardsHeading: "Shop by Category",
  categories: [
    {
      label: "Moms",
      href: "/collections/moms",
      colorClass: "from-blush/40 to-cream",
    },
    {
      label: "Dads",
      href: "/collections/dads",
      colorClass: "from-sage/40 to-cream",
    },
    {
      label: "Kids",
      href: "/collections/kids",
      colorClass: "from-terracotta-light/30 to-cream",
    },
    {
      label: "Accessories",
      href: "/collections/accessories",
      colorClass: "from-oat to-cream",
    },
  ],
  featuredSections: [
    {
      collectionHandle: "new-arrivals",
      title: "New Arrivals",
      subtitle: "Fresh drops for the whole family",
    },
    {
      collectionHandle: "staples",
      title: "Evergreen Staples",
      subtitle: "The essentials that never go out of style",
    },
  ],
};

// ─── Scheduled Content (for dashboard) ───────────────────────────────────────

export type ScheduledItem = {
  type: "announcement" | "campaign" | "blog";
  label: string;
  date: string;
  action: "starts" | "ends" | "publishes" | "unpublishes";
  editUrl: string;
};
