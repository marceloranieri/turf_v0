import { useState } from 'react'
import { GiphySearchResult } from '@/app/lib/giphy'

interface UseGiphyReturn {
  gifs: GiphySearchResult[]
  loading: boolean
  error: string | null
  searchGifs: (query: string, limit?: number) => Promise<void>
  getRandomGif: (tag: string) => Promise<void>
  getTrendingGifs: (limit?: number) => Promise<void>
}

export function useGiphy(): UseGiphyReturn {
  const [gifs, setGifs] = useState<GiphySearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchGifs = async (query: string, limit: number = 10) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/giphy?type=search&query=${encodeURIComponent(query)}&limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch GIFs')
      const { data } = await response.json()
      setGifs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GIFs')
    } finally {
      setLoading(false)
    }
  }

  const getRandomGif = async (tag: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/giphy?type=random&tag=${encodeURIComponent(tag)}`)
      if (!response.ok) throw new Error('Failed to fetch random GIF')
      const { data } = await response.json()
      setGifs([data])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch random GIF')
    } finally {
      setLoading(false)
    }
  }

  const getTrendingGifs = async (limit: number = 10) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/giphy?type=trending&limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch trending GIFs')
      const { data } = await response.json()
      setGifs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending GIFs')
    } finally {
      setLoading(false)
    }
  }

  return {
    gifs,
    loading,
    error,
    searchGifs,
    getRandomGif,
    getTrendingGifs,
  }
} 