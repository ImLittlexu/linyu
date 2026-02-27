/**
 * GET /random/json
 * 随机返回图片信息（JSON 格式，不重定向）
 */
import { pickRandom, IMAGES, CORS_HEADERS } from '../_shared.js'

export async function onRequest(context) {
  const { request } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  const file = pickRandom()
  return new Response(
    JSON.stringify({
      url: `/img/${file}`,
      filename: file,
      total: IMAGES.length,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...CORS_HEADERS,
      },
    }
  )
}
