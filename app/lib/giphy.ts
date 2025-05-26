const GIPHY_API_KEY = process.env.GIPHY_API_KEY
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs'

export interface GiphySearchResult {
  id: string
  title: string
  url: string
  images: {
    original: {
      url: string
    }
    fixed_height: {
      url: string
    }
  }
}

export async function searchGifs(query: string, limit: number = 10): Promise<GiphySearchResult[]> {
  try {
    const response = await fetch(
      `${GIPHY_API_URL}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&rating=g`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch GIFs')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error searching GIFs:', error)
    throw error
  }
}

export async function getRandomGif(tag: string): Promise<GiphySearchResult> {
  try {
    const response = await fetch(
      `${GIPHY_API_URL}/random?api_key=${GIPHY_API_KEY}&tag=${encodeURIComponent(tag)}&rating=g`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch random GIF')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching random GIF:', error)
    throw error
  }
}

export async function getTrendingGifs(limit: number = 10): Promise<GiphySearchResult[]> {
  try {
    const response = await fetch(
      `${GIPHY_API_URL}/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=g`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch trending GIFs')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching trending GIFs:', error)
    throw error
  }
}
