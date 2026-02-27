/**
 * GET /random
 * 随机返回一张图片（302 重定向至绝对 URL）
 */
import { pickRandom, CORS_HEADERS } from './_shared.js'

export async function onRequest(context) {
  const { request } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  const file = pickRandom()
  const imageUrl = new URL(`/img/${file}`, request.url).toString()
  return Response.redirect(imageUrl, 302)
}
