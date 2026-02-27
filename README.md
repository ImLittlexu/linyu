# Random Image API

托管在 **EdgeOne Pages** 上的随机图片接口，从 `/img` 目录中随机返回一张图片。

---

## 接口说明

| 接口 | 方法 | 说明 |
|------|------|------|
| `/random` | GET | 随机返回一张图片（302 重定向至图片地址）|
| `/random/json` | GET | 随机返回图片信息（JSON 格式，不重定向）|
| `/list` | GET | 返回全部图片列表 |

### `/random`
直接访问该接口，浏览器会自动跳转到随机图片：
```
GET https://your-domain.edgeone.app/random
→ 302 /img/XXXX.jpg
```

适用于 `<img>` 标签直接引用：
```html
<img src="https://your-domain.edgeone.app/random" alt="随机图片">
```

### `/random/json`
返回 JSON 格式的图片信息，适合前端 fetch 后自行处理：
```json
{
  "url": "/img/FDFE6006877A9A33C723831AB931C5A6.jpg",
  "filename": "FDFE6006877A9A33C723831AB931C5A6.jpg",
  "total": 163
}
```

### `/list`
返回全部可用图片列表：
```json
{
  "total": 163,
  "images": [
    { "filename": "00F7BFD9.png", "url": "/img/00F7BFD9.png" },
    ...
  ]
}
```

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地服务（默认 3000 端口）
npm run dev
```

访问 `http://localhost:3000/random`

---

## 部署到 EdgeOne Pages

1. 将项目推送到 Git 仓库（GitHub / GitLab / Gitee）
2. 在 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/pages) 创建项目
3. 关联仓库，**无需配置构建命令**（静态站点 + Functions）
4. 部署完成后即可使用接口

---

## 维护图片列表

EdgeOne Pages 的边缘函数无法访问文件系统，图片列表被硬编码在 `functions/[[path]].js` 的 `IMAGES` 数组中。

新增图片后，需要同步在 `IMAGES` 数组中添加对应文件名，例如：

```javascript
const IMAGES = [
  // ... 现有图片
  'NEW_IMAGE_FILE.jpg',  // 新增
]
```
