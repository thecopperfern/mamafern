import { config, fields, collection } from '@keystatic/core';

/**
 * Keystatic CMS Configuration
 *
 * Storage strategy:
 * - Development: local storage — reads/writes files directly on disk, no GitHub auth needed
 * - Production:  GitHub storage — saves are committed directly to the thecopperfern/mamafern
 *                repo, so content is version-controlled and survives server restarts/redeploys
 *
 * Production workflow after saving a post in Keystatic:
 *   1. Keystatic commits the new .mdx file to GitHub (main branch)
 *   2. SSH into Hostinger and run: git pull
 *   3. Post appears immediately — no rebuild needed (blog pages use force-dynamic)
 *
 * Required env vars (production only):
 *   KEYSTATIC_GITHUB_CLIENT_ID     — from your GitHub OAuth App
 *   KEYSTATIC_GITHUB_CLIENT_SECRET — from your GitHub OAuth App
 *   KEYSTATIC_SECRET               — random string: openssl rand -hex 32
 *
 * See .env.example for setup instructions.
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
