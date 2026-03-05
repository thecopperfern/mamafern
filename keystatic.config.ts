import { config, fields, collection, singleton } from '@keystatic/core';
import {
  navigationSchema,
  footerSchema,
  contactPageSchema,
  shopPageSchema,
  homepageSectionsSchema,
  popupSettingsSchema,
  campaignsSchema,
  styleGuidesSchema,
  mediaGuidelinesSchema,
  quizzesSchema,
  leadMagnetsSchema,
} from './src/lib/keystatic/schemas';

/**
 * Keystatic CMS Configuration
 *
 * Storage strategy:
 * - Development: local — reads/writes files directly on disk, no GitHub auth needed
 * - Production:  GitHub — saves are committed directly to the thecopperfern/mamafern
 *                repo via the configured GitHub OAuth App, so content is version-
 *                controlled and survives server restarts/redeploys
 *
 * Access is protected by a shared password gate (see src/middleware.ts) so the
 * marketing team only needs ONE password to reach the Keystatic UI. They then
 * sign in with their GitHub account via the OAuth App to actually save/commit.
 * Team members do not need to be manually added as repo collaborators — they
 * authenticate through the OAuth App which has repo access.
 *
 * Required env vars (production):
 *   NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG — GitHub App slug (e.g. "mama-fern-cms")
 *   KEYSTATIC_SECRET               — random string: openssl rand -hex 32
 *   KEYSTATIC_PASSWORD             — shared password for the /keystatic route
 *
 * Production workflow:
 *   1. Visit https://mamafern.com/keystatic → enter shared password
 *   2. Sign in with GitHub App (one-time per browser)
 *   3. Create/edit posts → Keystatic commits the MDX file to GitHub automatically
 *   4. On Hostinger, run: git pull → post appears immediately (force-dynamic)
 *
 * See .env.example for full setup instructions.
 */
export default config({
  // Use GitHub storage when the app slug is configured (production).
  // Falls back to local storage for dev or when env vars aren't set (build time).
  storage: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
    ? {
        kind: 'github',
        repo: {
          owner: 'thecopperfern',
          name: 'mamafern',
        },
      }
    : { kind: 'local' },
  ui: {
    navigation: {
      'Content': ['posts', 'campaigns', 'styleGuides', 'quizzes', 'leadMagnets'],
      'Pages': ['aboutPage', 'faqPage', 'communityPage', 'contactPage', 'homepageHero', 'homepageSections', 'shopPage'],
      'Layout': ['navigation', 'footer', 'announcementBar', 'popupSettings'],
      'Settings': ['siteSettings', 'mediaGuidelines'],
    },
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        publishDate: fields.datetime({ label: 'Publish Date (optional)' }),
        unpublishDate: fields.datetime({ label: 'Unpublish Date (optional)' }),
        slug: fields.text({
          label: 'Slug (Optional — defaults to filename)',
          description: 'Leave blank to use the filename as the slug.',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        author: fields.text({
          label: 'Author',
          description: 'Author name. Defaults to "Mama Fern Team" if left blank.',
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/blog',
          publicPath: '/images/blog',
        }),
        leadMagnetSlug: fields.text({
          label: 'Lead Magnet Slug (optional)',
          description: 'Reference a lead magnet to display in this post. Use the slug from the Lead Magnets collection.',
        }),
        relatedContent: fields.array(
          fields.object({
            type: fields.select({
              label: 'Type',
              options: [
                { label: 'Blog Post', value: 'blog' },
                { label: 'Product', value: 'product' },
                { label: 'Collection', value: 'collection' },
              ],
              defaultValue: 'blog',
            }),
            handle: fields.text({ label: 'Slug / Handle' }),
            label: fields.text({ label: 'Display Label' }),
          }),
          {
            label: 'Related Content Links',
            itemLabel: (props) =>
              `[${props.fields.type.value}] ${props.fields.label.value || props.fields.handle.value}`,
          }
        ),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
    campaigns: campaignsSchema,
    styleGuides: styleGuidesSchema,
    quizzes: quizzesSchema,
    leadMagnets: leadMagnetsSchema,
  },
  singletons: {
    // ─── Pages ────────────────────────────────────────────────────────────────

    aboutPage: singleton({
      label: 'About Page',
      path: 'content/pages/about',
      format: { data: 'yaml' },
      schema: {
        // Hero
        heroEyebrow: fields.text({ label: 'Hero Eyebrow', defaultValue: 'Our Story' }),
        heroTitle: fields.text({ label: 'Hero Title', defaultValue: 'About Mama Fern' }),
        heroSubtitle: fields.text({ label: 'Hero Subtitle', defaultValue: 'Grounded family apparel for crunchy, cozy homes.' }),

        // Brand story
        brandStoryHeading: fields.text({ label: 'Brand Story Heading', defaultValue: 'What Is Mama Fern?' }),
        brandStoryParagraphs: fields.array(
          fields.text({ label: 'Paragraph', multiline: true }),
          { label: 'Brand Story Paragraphs', itemLabel: props => props.value.slice(0, 60) + '...' }
        ),
        brandStoryBlockquote: fields.text({
          label: 'Brand Story Blockquote',
          defaultValue: 'Clothing that celebrates the grounded, cozy life — for the whole crew.',
        }),

        // Mission
        missionEyebrow: fields.text({ label: 'Mission Eyebrow', defaultValue: 'Why We Exist' }),
        missionHeading: fields.text({ label: 'Mission Heading', defaultValue: 'Our Mission' }),
        missionBody: fields.text({ label: 'Mission Body', multiline: true }),

        // Values
        valuesHeading: fields.text({ label: 'Values Section Heading', defaultValue: 'What We Stand For' }),
        values: fields.array(
          fields.object({
            emoji: fields.text({ label: 'Emoji' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Values', itemLabel: props => props.fields.title.value }
        ),

        // Brand FAQs
        brandFaqHeading: fields.text({ label: 'Brand FAQ Heading', defaultValue: 'Frequently Asked About Mama Fern' }),
        brandFaqs: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'Brand FAQs', itemLabel: props => props.fields.question.value }
        ),

        // CTA
        ctaEyebrow: fields.text({ label: 'CTA Eyebrow', defaultValue: 'Dress the Whole Crew' }),
        ctaHeading: fields.text({ label: 'CTA Heading', defaultValue: 'Made for Your Family' }),
        ctaBody: fields.text({ label: 'CTA Body', multiline: true }),
        ctaButtonText: fields.text({ label: 'CTA Button Text', defaultValue: 'Shop All' }),
        ctaButtonHref: fields.text({ label: 'CTA Button Link', defaultValue: '/shop' }),

        // SEO
        seoTitle: fields.text({ label: 'SEO Title', defaultValue: 'Our Story' }),
        seoDescription: fields.text({ label: 'SEO Description', multiline: true }),
        seoKeywords: fields.array(
          fields.text({ label: 'Keyword' }),
          { label: 'SEO Keywords', itemLabel: props => props.value }
        ),

        // JSON-LD
        jsonLdDescription: fields.text({ label: 'JSON-LD Organization Description', multiline: true }),
        jsonLdFoundingDate: fields.text({ label: 'JSON-LD Founding Year', defaultValue: '2024' }),
      },
    }),

    faqPage: singleton({
      label: 'FAQ Page',
      path: 'content/pages/faq',
      format: { data: 'yaml' },
      schema: {
        // Hero
        heroEyebrow: fields.text({ label: 'Hero Eyebrow', defaultValue: 'Got Questions?' }),
        heroTitle: fields.text({ label: 'Hero Title', defaultValue: 'Frequently Asked Questions' }),
        heroSubtitle: fields.text({ label: 'Hero Subtitle', defaultValue: 'Everything you need to know about orders, materials, and more.' }),

        // FAQs
        faqs: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'FAQs', itemLabel: props => props.fields.question.value }
        ),

        // CTA
        ctaEyebrow: fields.text({ label: 'CTA Eyebrow', defaultValue: 'Need More Help?' }),
        ctaHeading: fields.text({ label: 'CTA Heading', defaultValue: 'Still have questions?' }),
        ctaBody: fields.text({ label: 'CTA Body', defaultValue: "We're always happy to help. Reach out and we'll get back to you soon." }),
        ctaButtonText: fields.text({ label: 'CTA Button Text', defaultValue: 'Contact Us' }),
        ctaButtonHref: fields.text({ label: 'CTA Button Link', defaultValue: '/contact' }),

        // SEO
        seoTitle: fields.text({ label: 'SEO Title', defaultValue: 'FAQ' }),
        seoDescription: fields.text({ label: 'SEO Description', multiline: true }),
        seoKeywords: fields.array(
          fields.text({ label: 'Keyword' }),
          { label: 'SEO Keywords', itemLabel: props => props.value }
        ),
      },
    }),

    communityPage: singleton({
      label: 'Community Page',
      path: 'content/pages/community',
      format: { data: 'yaml' },
      schema: {
        // Hero
        heroEyebrow: fields.text({ label: 'Hero Eyebrow', defaultValue: 'Mama Fern Community' }),
        heroTitle: fields.text({ label: 'Hero Title', defaultValue: 'Welcome to Our Family' }),
        heroSubtitle: fields.text({ label: 'Hero Subtitle', defaultValue: 'Stories, updates, and a little inspiration from the families who wear Mama Fern.' }),

        // Featured post
        featuredEyebrow: fields.text({ label: 'Featured Post Eyebrow', defaultValue: 'Welcome' }),
        featuredHeading: fields.text({ label: 'Featured Post Heading', defaultValue: 'Hello from Mama Fern' }),
        featuredBody: fields.text({ label: 'Featured Post Body', multiline: true }),
        featuredMeta: fields.text({ label: 'Featured Post Meta', defaultValue: 'Posted by the Mama Fern team — Feb 2026' }),

        // Values
        valuesHeading: fields.text({ label: 'Values Section Heading', defaultValue: 'What Brings Us Together' }),
        values: fields.array(
          fields.object({
            emoji: fields.text({ label: 'Emoji' }),
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Values', itemLabel: props => props.fields.title.value }
        ),

        // CTA
        ctaEyebrow: fields.text({ label: 'CTA Eyebrow', defaultValue: 'Stay Connected' }),
        ctaHeading: fields.text({ label: 'CTA Heading', defaultValue: 'More stories coming soon' }),
        ctaBody: fields.text({ label: 'CTA Body', multiline: true }),
        primaryButtonText: fields.text({ label: 'Primary Button Text', defaultValue: 'Shop the Collection' }),
        primaryButtonHref: fields.text({ label: 'Primary Button Link', defaultValue: '/shop' }),
        secondaryButtonText: fields.text({ label: 'Secondary Button Text', defaultValue: 'Share Your Story' }),
        secondaryButtonHref: fields.text({ label: 'Secondary Button Link', defaultValue: '/contact' }),

        // SEO
        seoTitle: fields.text({ label: 'SEO Title', defaultValue: 'Community' }),
        seoDescription: fields.text({ label: 'SEO Description', multiline: true }),
        seoKeywords: fields.array(
          fields.text({ label: 'Keyword' }),
          { label: 'SEO Keywords', itemLabel: props => props.value }
        ),
      },
    }),

    homepageHero: singleton({
      label: 'Homepage Hero',
      path: 'content/pages/homepage-hero',
      format: { data: 'yaml' },
      schema: {
        headlineLine1: fields.text({ label: 'Headline Line 1', defaultValue: 'For every stage of' }),
        headlineHighlight: fields.text({ label: 'Headline Highlighted Text', defaultValue: 'growing together' }),
        subtitle: fields.text({
          label: 'Subtitle',
          multiline: true,
          defaultValue: 'Grounded family apparel in skin-friendlier fabrics. Cute patterns and cozy sayings for moms, dads, and kids.',
        }),
        primaryButtonText: fields.text({ label: 'Primary Button Text', defaultValue: 'Shop All' }),
        primaryButtonHref: fields.text({ label: 'Primary Button Link', defaultValue: '/shop' }),
        secondaryButtonText: fields.text({ label: 'Secondary Button Text', defaultValue: 'Shop Kids' }),
        secondaryButtonHref: fields.text({ label: 'Secondary Button Link', defaultValue: '/collections/kids' }),
      },
    }),

    // ─── New Page Singletons ─────────────────────────────────────────────────

    contactPage: contactPageSchema,
    homepageSections: homepageSectionsSchema,
    shopPage: shopPageSchema,

    // ─── Layout ──────────────────────────────────────────────────────────────

    navigation: navigationSchema,
    footer: footerSchema,

    announcementBar: singleton({
      label: 'Announcement Bar',
      path: 'content/pages/announcement-bar',
      format: { data: 'yaml' },
      schema: {
        enabled: fields.checkbox({ label: 'Enabled', defaultValue: false }),
        message: fields.text({ label: 'Message', defaultValue: '' }),
        linkText: fields.text({ label: 'Link Text (optional)', defaultValue: '' }),
        linkHref: fields.text({ label: 'Link URL (optional)', defaultValue: '' }),
        backgroundColor: fields.select({
          label: 'Background Color',
          options: [
            { label: 'Fern (Green)', value: 'fern' },
            { label: 'Sage (Muted Green)', value: 'sage' },
            { label: 'Terracotta (Warm)', value: 'terracotta' },
            { label: 'Charcoal (Dark)', value: 'charcoal' },
          ],
          defaultValue: 'fern',
        }),
        scheduledFrom: fields.datetime({ label: 'Show From (optional)' }),
        scheduledUntil: fields.datetime({ label: 'Show Until (optional)' }),
      },
    }),

    popupSettings: popupSettingsSchema,

    // ─── Settings ────────────────────────────────────────────────────────────

    siteSettings: singleton({
      label: 'Site Settings',
      path: 'content/pages/site-settings',
      format: { data: 'yaml' },
      schema: {
        brandName: fields.text({ label: 'Brand Name', defaultValue: 'Mama Fern' }),
        tagline: fields.text({ label: 'Tagline', defaultValue: 'Grounded Family Apparel' }),
        baseUrl: fields.text({ label: 'Base URL', defaultValue: 'https://mamafern.com' }),
        twitterHandle: fields.text({ label: 'Twitter Handle', defaultValue: '@mamafern' }),
        defaultOgImage: fields.text({ label: 'Default OG Image Path', defaultValue: '/og-image.png' }),
        defaultDescription: fields.text({
          label: 'Default Description',
          multiline: true,
          defaultValue: 'Grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs for moms, dads, and kids who love the outdoors.',
        }),
        defaultKeywords: fields.array(
          fields.text({ label: 'Keyword' }),
          { label: 'Default Keywords', itemLabel: props => props.value }
        ),
        instagramUrl: fields.text({ label: 'Instagram URL', defaultValue: '' }),
        tiktokUrl: fields.text({ label: 'TikTok URL', defaultValue: '' }),
        pinterestUrl: fields.text({ label: 'Pinterest URL', defaultValue: '' }),
      },
    }),

    mediaGuidelines: mediaGuidelinesSchema,
  },
});
