import { getPayload } from 'payload'
// @ts-ignore — resolved by @payload-config alias at runtime
import config from '@payload-config'
import content from '../content.json'

const EMPLOYMENT = [
  { label: "Shopify. 25—Now" },
  { label: "Dispatches. 21—Now" },
  { label: "Freelance. 22—25" },
  { label: "VCU Adjunct. 22—24" },
  { label: "Robinhood. 21—22" },
  { label: "Dropbox. 19—21" },
  { label: "Google. 18—19" },
]

async function seed() {
  const payload = await getPayload({ config })

  for (const [i, project] of content.projects.entries()) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`skip  ${project.slug}`)
      continue
    }

    await payload.create({
      collection: 'projects',
      data: {
        title: project.title,
        slug: project.slug,
        url: project.url ?? undefined,
        description: project.description,
        order: i,
        images: project.images.map((src) => ({ src })),
      },
    })
    console.log(`ok    ${project.slug}`)
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      bio: content.bio,
      employment: EMPLOYMENT,
    },
  })
  console.log('ok    site-settings')

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
