import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: process.env.NODE_ENV === 'development' 
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: {
          owner: 'YOUR_GITHUB_USERNAME',
          name: 'YOUR_REPO_NAME',
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
        slug: fields.text({ label: 'Slug (Optional - defaults to filename)', description: 'Leave blank to use the filename as the slug.' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        featuredImage: fields.image({ 
          label: 'Featured Image', 
          directory: 'public/images/blog', 
          publicPath: '/images/blog' 
        }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
