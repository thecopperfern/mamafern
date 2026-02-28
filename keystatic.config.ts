import { config, fields, collection } from '@keystatic/core';

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
 *   KEYSTATIC_GITHUB_CLIENT_ID     — from your GitHub OAuth App
 *   KEYSTATIC_GITHUB_CLIENT_SECRET — from your GitHub OAuth App
 *   KEYSTATIC_SECRET               — random string: openssl rand -hex 32
 *   KEYSTATIC_PASSWORD             — shared password for the /keystatic route
 *
 * Production workflow:
 *   1. Visit https://mamafern.com/keystatic → enter shared password
 *   2. Sign in with GitHub (one-time per browser)
 *   3. Create/edit posts → Keystatic commits the MDX file to GitHub automatically
 *   4. On Hostinger, run: git pull → post appears immediately (force-dynamic)
 *
 * See .env.example for full setup instructions.
 */
export default config({
  storage: process.env.NODE_ENV === 'production'
    ? {
        kind: 'github',
        repo: {
          owner: 'thecopperfern',
          name: 'mamafern',
        },
      }
    : { kind: 'local' },
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
        slug: fields.text({
          label: 'Slug (Optional — defaults to filename)',
          description: 'Leave blank to use the filename as the slug.',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/blog',
          publicPath: '/images/blog',
        }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
