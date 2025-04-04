import { gt, sql, and } from 'drizzle-orm'

import db from '../../../db'
import { advocates } from '../../../db/schema'

const PAGE_LIMIT = 5

export async function GET(request: Request) {
  const url = new URL(request.url)

  const lastId = parseInt(url.searchParams.get('lastId') || '0', 10)
  const query = url.searchParams.get('query') || ''

  const words = query.split(/\s+/).filter(Boolean)
  const conditions = words.map(
    word => sql`${advocates.searchTrigram} ilike ${'%' + word + '%'}`
  )

  const data: typeof advocates.$inferSelect[] = await db
    .select()
    .from(advocates)
    .where(and(gt(advocates.id, lastId), ...conditions))
    .limit(PAGE_LIMIT)

  return Response.json(
    { data, done: data.length < PAGE_LIMIT },
    { status: 200 }
  )
}
