import sharp from 'sharp'

interface ImageDimensions {
  width: number
  height: number
}

interface ProcessedImage {
  blob: Blob
  dimensions: ImageDimensions
}

export async function processImage(file: File): Promise<ProcessedImage> {
  // Check file size (3MB max)
  if (file.size > 3 * 1024 * 1024) {
    throw new Error('Image must be less than 3MB')
  }

  // Check file type
  if (!isImageFile(file)) {
    throw new Error('File must be an image')
  }

  // Send to API for processing
  const response = await fetch('/api/image/resize', {
    method: 'POST',
    body: file
  })

  if (!response.ok) {
    throw new Error('Image processing failed')
  }

  const blob = await response.blob()
  
  // Get dimensions from the processed image
  const dimensions = await getImageDimensions(blob)

  return {
    blob,
    dimensions
  }
}

async function getImageDimensions(blob: Blob): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(blob)
  })
}

export function getImageSize(buffer: Buffer): number {
  return buffer.length
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function isYouTubeUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return pattern.test(url)
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size (3MB max)
  if (file.size > 3 * 1024 * 1024) {
    return {
      valid: false,
      error: 'Image must be less than 3MB'
    }
  }

  // Check file type
  if (!isImageFile(file)) {
    return {
      valid: false,
      error: 'File must be an image'
    }
  }

  return { valid: true }
}

export function getResponsiveImageSizes(originalWidth: number): string {
  return `(max-width: 768px) ${Math.round(originalWidth * 0.75)}px, ${originalWidth}px`
} 