/**
 * 本地开发调试用 Koa 服务
 * EdgeOne Pages 生产环境请使用 functions/[[path]].js
 */
const Koa = require('koa')
const Router = require('@koa/router')
const serve = require('koa-static')
const path = require('path')
const fs = require('fs')

const app = new Koa()
const router = new Router()

// 静态资源服务（本地调试用）
app.use(serve(path.join(__dirname, 'public')))
app.use(serve(path.join(__dirname)))

// CORS 中间件
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type')
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204
    return
  }
  await next()
})

/**
 * 获取 img 目录下所有图片文件名
 */
function getImageList() {
  const imgDir = path.join(__dirname, 'img')
  try {
    return fs
      .readdirSync(imgDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file))
      .sort((left, right) => left.localeCompare(right, 'en'))
  } catch {
    return []
  }
}

function parsePositiveInt(value) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function buildImagePage(images, query = {}) {
  const offsetParam = parsePositiveInt(query.offset)
  const limitParam = parsePositiveInt(query.limit)
  const hasPagination = query.offset !== undefined || query.limit !== undefined

  const total = images.length
  const offset = Math.min(offsetParam ?? 0, total)
  const limit = Math.min(limitParam ?? (hasPagination ? 24 : total), total)
  const pageImages = images.slice(offset, offset + limit)
  const nextOffset = offset + pageImages.length

  return {
    total,
    offset,
    limit,
    count: pageImages.length,
    hasMore: nextOffset < total,
    nextOffset,
    images: pageImages.map(filename => ({ filename, url: `/img/${filename}` }))
  }
}

/**
 * GET /random
 * 随机返回一张图片（302 重定向到图片地址）
 */
router.get('/random', async (ctx) => {
  const images = getImageList()
  if (images.length === 0) {
    ctx.status = 404
    ctx.body = { error: 'img 目录下暂无图片' }
    return
  }
  const file = images[Math.floor(Math.random() * images.length)]
  ctx.redirect(`/img/${file}`)
})

/**
 * GET /random/json
 * 随机返回图片的 JSON 信息（不重定向）
 */
router.get('/random/json', async (ctx) => {
  const images = getImageList()
  if (images.length === 0) {
    ctx.status = 404
    ctx.body = { error: 'img 目录下暂无图片' }
    return
  }
  const file = images[Math.floor(Math.random() * images.length)]
  ctx.body = {
    url: `/img/${file}`,
    filename: file,
    total: images.length
  }
})

/**
 * GET /list
 * 返回所有图片列表
 */
router.get('/list', async (ctx) => {
  const images = getImageList()
  ctx.body = buildImagePage(images, ctx.query)
})

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`本地服务已启动：http://localhost:${PORT}`)
  console.log('接口：')
  console.log(`  GET http://localhost:${PORT}/random       → 随机返回图片（302重定向）`)
  console.log(`  GET http://localhost:${PORT}/random/json  → 随机返回图片信息（JSON）`)
  console.log(`  GET http://localhost:${PORT}/list         → 返回全部图片列表`)
})

module.exports = app
