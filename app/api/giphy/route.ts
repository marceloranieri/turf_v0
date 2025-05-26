import { NextResponse } from 'next/server'
import { searchGifs, getRandomGif, getTrendingGifs } from '@/app/lib/giphy'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const tag = searchParams.get('tag')
  const limit = parseInt(searchParams.get('limit') || '10')
  const type = searchParams.get('type') || 'search'

  try {
    let data

    switch (type) {
      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Query parameter is required for search' },
            { status: 400 }
          )
        }
        data = await searchGifs(query, limit)
        break

      case 'random':
        if (!tag) {
          return NextResponse.json(
            { error: 'Tag parameter is required for random GIF' },
            { status: 400 }
          )
        }
        data = await getRandomGif(tag)
        break

      case 'trending':
        data = await getTrendingGifs(limit)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Giphy API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GIFs' },
      { status: 500 }
    )
  }
} 