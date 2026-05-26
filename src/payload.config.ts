import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
    {
      slug: 'projects',
      orderable: true,
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'updatedAt'],
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'url', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'images',
          type: 'array',
          fields: [
            { name: 'src', type: 'text', required: true, admin: { description: 'Path e.g. /projects/dispatches/01.webp' } },
          ],
        },
      ],
    },
  ],
  globals: [
    {
      slug: 'site-settings',
      admin: { group: 'Site' },
      fields: [
        { name: 'bio', type: 'textarea' },
        {
          name: 'employment',
          type: 'array',
          admin: { description: 'Displayed in order' },
          fields: [
            { name: 'label', type: 'text', required: true, admin: { description: 'e.g. Shopify. 25—Now' } },
          ],
        },
      ],
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: process.env.NODE_ENV === 'development',
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
