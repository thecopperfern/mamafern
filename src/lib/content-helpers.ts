/**
 * Content Helpers
 *
 * Typed wrapper functions around Keystatic reader calls. Every function
 * catches errors and returns hardcoded defaults so pages never break
 * if a content file is missing or malformed.
 *
 * All pages should import from here instead of using `reader` directly
 * for CMS data that feeds into layout/components.
 */

import reader from "@/lib/content";
import {
  type NavigationData,
  DEFAULT_NAVIGATION,
  type FooterData,
  DEFAULT_FOOTER,
  type AnnouncementData,
  type PopupData,
  DEFAULT_POPUP,
  type ShopPageData,
  DEFAULT_SHOP_PAGE,
  type ContactPageData,
  DEFAULT_CONTACT_PAGE,
  type HomepageSectionsData,
  DEFAULT_HOMEPAGE_SECTIONS,
  type ScheduledItem,
} from "./content-types";

// ─── Navigation ──────────────────────────────────────────────────────────────

export async function getNavigation(): Promise<NavigationData> {
  try {
    const data = await reader.singletons.navigation.read();
    if (!data) return DEFAULT_NAVIGATION;
    return {
      mainLinks:
        data.mainLinks && data.mainLinks.length > 0
          ? data.mainLinks
          : DEFAULT_NAVIGATION.mainLinks,
      infoLinks:
        data.infoLinks && data.infoLinks.length > 0
          ? data.infoLinks
          : DEFAULT_NAVIGATION.infoLinks,
    };
  } catch {
    return DEFAULT_NAVIGATION;
  }
}

// ─── Footer ──────────────────────────────────────────────────────────────────

export async function getFooterData(): Promise<FooterData> {
  try {
    const data = await reader.singletons.footer.read();
    if (!data) return DEFAULT_FOOTER;
    return {
      brandDescription:
        data.brandDescription || DEFAULT_FOOTER.brandDescription,
      shopLinks:
        data.shopLinks && data.shopLinks.length > 0
          ? data.shopLinks
          : DEFAULT_FOOTER.shopLinks,
      infoLinks:
        data.infoLinks && data.infoLinks.length > 0
          ? data.infoLinks
          : DEFAULT_FOOTER.infoLinks,
      legalLinks:
        data.legalLinks && data.legalLinks.length > 0
          ? data.legalLinks
          : DEFAULT_FOOTER.legalLinks,
      newsletterHeading:
        data.newsletterHeading || DEFAULT_FOOTER.newsletterHeading,
      newsletterSubtitle:
        data.newsletterSubtitle || DEFAULT_FOOTER.newsletterSubtitle,
    };
  } catch {
    return DEFAULT_FOOTER;
  }
}

// ─── Announcement Bar ────────────────────────────────────────────────────────

/**
 * Reads the announcement bar singleton and checks schedule.
 * Returns null if disabled, outside schedule, or on error.
 */
export async function getAnnouncementWithSchedule(): Promise<AnnouncementData | null> {
  try {
    const data = await reader.singletons.announcementBar.read();
    if (!data?.enabled || !data.message) return null;

    const now = new Date();
    const scheduledFrom = (data as Record<string, unknown>).scheduledFrom as string | null;
    const scheduledUntil = (data as Record<string, unknown>).scheduledUntil as string | null;

    if (scheduledFrom && new Date(scheduledFrom) > now) return null;
    if (scheduledUntil && new Date(scheduledUntil) <= now) return null;

    return {
      enabled: data.enabled,
      message: data.message,
      linkText: data.linkText,
      linkHref: data.linkHref,
      backgroundColor: data.backgroundColor,
      scheduledFrom: scheduledFrom ?? null,
      scheduledUntil: scheduledUntil ?? null,
    };
  } catch {
    return null;
  }
}

// ─── Popup Settings ──────────────────────────────────────────────────────────

export async function getPopupSettings(): Promise<PopupData> {
  try {
    const data = await reader.singletons.popupSettings.read();
    if (!data) return DEFAULT_POPUP;
    return {
      enabled: data.enabled ?? DEFAULT_POPUP.enabled,
      heading: data.heading || DEFAULT_POPUP.heading,
      offerText: data.offerText || DEFAULT_POPUP.offerText,
      buttonText: data.buttonText || DEFAULT_POPUP.buttonText,
      disclaimer: data.disclaimer || DEFAULT_POPUP.disclaimer,
      exitIntentHeading:
        data.exitIntentHeading || DEFAULT_POPUP.exitIntentHeading,
      exitIntentBody: data.exitIntentBody || DEFAULT_POPUP.exitIntentBody,
      exitIntentStayButton:
        data.exitIntentStayButton || DEFAULT_POPUP.exitIntentStayButton,
      exitIntentLeaveText:
        data.exitIntentLeaveText || DEFAULT_POPUP.exitIntentLeaveText,
      delayMs: data.delayMs ?? DEFAULT_POPUP.delayMs,
      cookieExpiryDays:
        data.cookieExpiryDays ?? DEFAULT_POPUP.cookieExpiryDays,
    };
  } catch {
    return DEFAULT_POPUP;
  }
}

// ─── Shop Page ───────────────────────────────────────────────────────────────

export async function getShopPage(): Promise<ShopPageData> {
  try {
    const data = await reader.singletons.shopPage.read();
    if (!data) return DEFAULT_SHOP_PAGE;
    return {
      heroEyebrow: data.heroEyebrow || DEFAULT_SHOP_PAGE.heroEyebrow,
      heroTitle: data.heroTitle || DEFAULT_SHOP_PAGE.heroTitle,
      heroSubtitle: data.heroSubtitle || DEFAULT_SHOP_PAGE.heroSubtitle,
    };
  } catch {
    return DEFAULT_SHOP_PAGE;
  }
}

// ─── Contact Page ────────────────────────────────────────────────────────────

export async function getContactPage(): Promise<ContactPageData> {
  try {
    const data = await reader.singletons.contactPage.read();
    if (!data) return DEFAULT_CONTACT_PAGE;
    return {
      heroEyebrow: data.heroEyebrow || DEFAULT_CONTACT_PAGE.heroEyebrow,
      heroTitle: data.heroTitle || DEFAULT_CONTACT_PAGE.heroTitle,
      heroSubtitle: data.heroSubtitle || DEFAULT_CONTACT_PAGE.heroSubtitle,
      contactInfoHeading:
        data.contactInfoHeading || DEFAULT_CONTACT_PAGE.contactInfoHeading,
      contactInfoItems:
        data.contactInfoItems && data.contactInfoItems.length > 0
          ? data.contactInfoItems
          : DEFAULT_CONTACT_PAGE.contactInfoItems,
      responseTimeLabel:
        data.responseTimeLabel || DEFAULT_CONTACT_PAGE.responseTimeLabel,
      responseTimeText:
        data.responseTimeText || DEFAULT_CONTACT_PAGE.responseTimeText,
    };
  } catch {
    return DEFAULT_CONTACT_PAGE;
  }
}

// ─── Homepage Sections ───────────────────────────────────────────────────────

export async function getHomepageSections(): Promise<HomepageSectionsData> {
  try {
    const data = await reader.singletons.homepageSections.read();
    if (!data) return DEFAULT_HOMEPAGE_SECTIONS;
    return {
      categoryCardsHeading:
        data.categoryCardsHeading ||
        DEFAULT_HOMEPAGE_SECTIONS.categoryCardsHeading,
      categories:
        data.categories && data.categories.length > 0
          ? data.categories
          : DEFAULT_HOMEPAGE_SECTIONS.categories,
      featuredSections:
        data.featuredSections && data.featuredSections.length > 0
          ? data.featuredSections
          : DEFAULT_HOMEPAGE_SECTIONS.featuredSections,
    };
  } catch {
    return DEFAULT_HOMEPAGE_SECTIONS;
  }
}

// ─── Scheduled Content (for dashboard) ───────────────────────────────────────

/**
 * Aggregates all scheduled content across announcements, campaigns, and blog
 * posts into a unified sorted list for the schedule dashboard.
 */
export async function getScheduledContent(): Promise<ScheduledItem[]> {
  const items: ScheduledItem[] = [];

  // Announcement bar
  try {
    const bar = await reader.singletons.announcementBar.read();
    if (bar?.enabled && bar.message) {
      const raw = bar as Record<string, unknown>;
      if (raw.scheduledFrom) {
        items.push({
          type: "announcement",
          label: bar.message,
          date: raw.scheduledFrom as string,
          action: "starts",
          editUrl: "/keystatic/singletons/announcementBar",
        });
      }
      if (raw.scheduledUntil) {
        items.push({
          type: "announcement",
          label: bar.message,
          date: raw.scheduledUntil as string,
          action: "ends",
          editUrl: "/keystatic/singletons/announcementBar",
        });
      }
    }
  } catch {
    // continue
  }

  // Campaigns
  try {
    const slugs = await reader.collections.campaigns.list();
    for (const slug of slugs) {
      const campaign = await reader.collections.campaigns.read(slug);
      if (!campaign) continue;
      const raw = campaign as Record<string, unknown>;
      if (raw.startDate) {
        items.push({
          type: "campaign",
          label: (raw.title as string) || slug,
          date: raw.startDate as string,
          action: "starts",
          editUrl: `/keystatic/collection/campaigns/${slug}`,
        });
      }
      if (raw.endDate) {
        items.push({
          type: "campaign",
          label: (raw.title as string) || slug,
          date: raw.endDate as string,
          action: "ends",
          editUrl: `/keystatic/collection/campaigns/${slug}`,
        });
      }
    }
  } catch {
    // campaigns collection may not exist yet
  }

  // Blog posts (use getAllPostsUnfiltered from blog.ts)
  try {
    const { getAllPostsUnfiltered } = await import("@/lib/blog");
    const posts = getAllPostsUnfiltered();
    for (const post of posts) {
      if (post.publishDate) {
        items.push({
          type: "blog",
          label: post.title,
          date: post.publishDate,
          action: "publishes",
          editUrl: `/keystatic/collection/posts/${post.slug}`,
        });
      }
      if (post.unpublishDate) {
        items.push({
          type: "blog",
          label: post.title,
          date: post.unpublishDate,
          action: "unpublishes",
          editUrl: `/keystatic/collection/posts/${post.slug}`,
        });
      }
    }
  } catch {
    // blog module may error
  }

  // Sort by date ascending (nearest first)
  return items.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
