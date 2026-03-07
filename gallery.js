const PAGE_SIZE = 24

const state = {
  offset: 0,
  total: null,
  hasMore: true,
  isLoading: false,
  loaded: 0,
}

const gallery = document.querySelector('#gallery')
const statusNode = document.querySelector('#status')
const sentinel = document.querySelector('#sentinel')
const loadedCountNode = document.querySelector('#loaded-count')
const totalCountNode = document.querySelector('#total-count')
const template = document.querySelector('#image-card-template')

function updateStats() {
  loadedCountNode.textContent = String(state.loaded)
  totalCountNode.textContent = state.total === null ? '-' : String(state.total)
}

function setStatus(message) {
  statusNode.textContent = message
}

function createCard(image, index) {
  const fragment = template.content.cloneNode(true)
  const card = fragment.querySelector('.card')
  const img = fragment.querySelector('img')
  const caption = fragment.querySelector('.card-caption')

  card.style.setProperty('--stagger-index', String(index % PAGE_SIZE))
  img.src = image.url
  img.alt = image.filename
  img.addEventListener('load', () => {
    card.classList.add('is-visible')
  }, { once: true })

  caption.textContent = image.filename
  return fragment
}

async function loadNextPage() {
  if (state.isLoading || !state.hasMore) {
    return
  }

  state.isLoading = true
  setStatus('正在加载下一批图片...')

  try {
    const response = await fetch(`/list?offset=${state.offset}&limit=${PAGE_SIZE}`)
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }

    const payload = await response.json()
    state.total = payload.total
    state.offset = payload.nextOffset
    state.hasMore = payload.hasMore
    state.loaded += payload.images.length
    updateStats()

    const fragment = document.createDocumentFragment()
    payload.images.forEach((image, index) => {
      fragment.appendChild(createCard(image, state.loaded - payload.images.length + index))
    })
    gallery.appendChild(fragment)

    if (state.loaded === 0) {
      setStatus('当前没有可展示的图片。')
    } else if (state.hasMore) {
      setStatus('继续下滑，自动加载更多图片。')
    } else {
      setStatus('全部图片已加载完成。')
    }
  } catch (error) {
    console.error(error)
    setStatus('加载失败，请稍后刷新重试。')
  } finally {
    state.isLoading = false
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      loadNextPage()
    }
  },
  {
    rootMargin: '1200px 0px',
  }
)

observer.observe(sentinel)
updateStats()
loadNextPage()