import { getPayload } from 'payload'
import { pushDevSchema } from '@payloadcms/drizzle'
import config from '@payload-config'
import { type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await pushDevSchema(payload.db as any)

  return Response.json({ ok: true })
}
