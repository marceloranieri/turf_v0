import sharp from 'sharp'

interface ImageDimensions {
  width: number
  height: number
}

interface ProcessedImage {
  buffer: Buffer
  dimensions: ImageDimensions
  format: 'jpeg' | 'webp'
}

export async function processImage(
  buffer: Buffer,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    format?: 'jpeg' | 'webp'
  } = {}
): Promise<ProcessedImage> {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 85,
    format = 'webp'
  } = options

  // Get original dimensions
  const metadata = await sharp(buffer).metadata()
  const originalWidth = metadata.width || 0
  const originalHeight = metadata.height || 0

  // Calculate new dimensions while maintaining aspect ratio
  let newWidth = originalWidth
  let newHeight = originalHeight

  if (originalWidth > maxWidth) {
    newWidth = maxWidth
    newHeight = Math.round((originalHeight * maxWidth) / originalWidth)
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = Math.round((newWidth * maxHeight) / newHeight)
  }

  // Check aspect ratio constraints (1:3 to 3:1)
  const aspectRatio = newWidth / newHeight
  if (aspectRatio < 1/3) {
    newWidth = Math.round(newHeight / 3)
  } else if (aspectRatio > 3) {
    newHeight = Math.round(newWidth / 3)
  }

  // Process image
  const processedBuffer = await sharp(buffer)
    .resize(newWidth, newHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFormat(format, {
      quality,
      progressive: true
    })
    .toBuffer()

  return {
    buffer: processedBuffer,
    dimensions: { width: newWidth, height: newHeight },
    format
  }
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
  // Check file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    return {
      valid: false,
      error: 'Image must be less than 2MB'
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