import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check content length (3MB limit)
  const contentLength = parseInt(req.headers['content-length'] || '0')
  if (contentLength > 3 * 1024 * 1024) {
    return res.status(413).json({ error: 'File too large. Maximum size is 3MB' })
  }

  const buffers: Buffer[] = []

  req.on('data', (chunk) => buffers.push(chunk))
  req.on('end', async () => {
    try {
      const inputBuffer = Buffer.concat(buffers)

      // Process image with sharp
      const processedImage = await sharp(inputBuffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: 85,
          progressive: true
        })
        .toBuffer()

      res.setHeader('Content-Type', 'image/jpeg')
      res.status(200).send(processedImage)
    } catch (err: any) {
      console.error('Sharp processing failed:', err)
      res.status(500).json({ error: 'Image processing failed' })
    }
  })
} 