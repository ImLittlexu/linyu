/**
 * GET /list
 * 返回全部图片列表（JSON 格式）
 */
import { IMAGES, CORS_HEADERS } from './_shared.js'

export async function onRequest(context) {
  const { request } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  return new Response(
    JSON.stringify({
      total: IMAGES.length,
      images: IMAGES.map((f) => ({ filename: f, url: `/img/${f}` })),
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
