import { config, fields, collection } from '@keystatic/core';

/**
 * Keystatic CMS Configuration
 *
 * Storage strategy: local — reads/writes MDX files directly on the server disk.
 * No GitHub OAuth required. Access is protected by a shared password via
 * Next.js middleware (see src/middleware.ts).
 *
 * Required env vars:
 *   KEYSTATIC_PASSWORD — the shared password for /keystatic (set in Hostinger hPanel)
 *   KEYSTATIC_SECRET   — random string used to sign the auth cookie: openssl rand -hex 32
 *
 * Workflow for marketing team:
 *   1. Go to https://mamafern.com/keystatic
 *   2. Enter the shared password
 *   3. Create/edit blog posts — they save immediately to the server
 *
 * Note: content lives in content/blog/ on the server filesystem. Periodically
 * commit new posts back to git to keep them version-controlled:
 *   git add content/blog/ && git commit -m "content: add new posts" && git push
 *
 * See .env.example for setup instructions.
 */
export default config({
  storage: { kind: 'local' },
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
