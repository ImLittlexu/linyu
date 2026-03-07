/**
 * GET /list
 * 返回图片列表；支持 offset 和 limit 分页参数
 */
import { buildImagePage, CORS_HEADERS } from './_shared.js'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  return new Response(
    JSON.stringify(buildImagePage(url)),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...CORS_HEADERS,
      },
    }
  )
}
