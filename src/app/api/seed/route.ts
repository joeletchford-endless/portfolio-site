import { getPayload } from 'payload'
import config from '@payload-config'
import content from '../../../../content.json'
import { type NextRequest } from 'next/server'

const EMPLOYMENT = [
  { label: "Shopify. 25—Now" },
  { label: "Dispatches. 21—Now" },
  { label: "Freelance. 22—25" },
  { label: "VCU Adjunct. 22—24" },
  { label: "Robinhood. 21—22" },
  { label: "Dropbox. 19—21" },
  { label: "Google. 18—19" },
]

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const log: string[] = []

  for (const [i, project] of content.projects.entries()) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      log.push(`skip  ${project.slug}`)
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
    log.push(`ok    ${project.slug}`)
  }

  const emp = (await payload.findGlobal({ slug: 'site-settings' })).employment as unknown[]
  if (!emp || emp.length === 0) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { bio: content.bio, employment: EMPLOYMENT },
    })
    log.push('ok    site-settings')
  } else {
    log.push('skip  site-settings')
  }

  return Response.json({ ok: true, log })
}
