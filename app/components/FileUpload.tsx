'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { validateImageFile, isYouTubeUrl, processImage } from '@/app/lib/image-processing'

interface FileUploadProps {
  onFileSelect: (file: File | Blob, type: 'image' | 'youtube') => void
  onCancel: () => void
}

export default function FileUpload({ onFileSelect, onCancel }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isYouTube, setIsYouTube] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      setIsProcessing(true)
      setError(null)

      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        return
      }

      // Process image
      const processed = await processImage(file)
      
      // Create preview
      const previewUrl = URL.createObjectURL(processed.blob)
      setPreview(previewUrl)
      
      // Pass processed image to parent
      onFileSelect(processed.blob, 'image')
    } catch (err: any) {
      setError(err.message || 'Failed to process image')
    } finally {
      setIsProcessing(false)
    }
  }, [onFileSelect])

  const handleYouTubeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!youtubeUrl) return

    if (!isYouTubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL')
      return
    }

    setError(null)
    onFileSelect(new File([youtubeUrl], 'youtube-url.txt', { type: 'text/plain' }), 'youtube')
    setIsYouTube(true)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024 // 3MB
  })

  return (
    <div className="w-full">
      {!isYouTube ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
        >
          <input {...getInputProps()} disabled={isProcessing} />
          {preview ? (
            <div className="relative aspect-video w-full max-w-md mx-auto">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setPreview(null)
                  onCancel()
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="py-8">
              <p className="text-gray-600">
                {isProcessing 
                  ? 'Processing image...'
                  : isDragActive
                    ? 'Drop the file here'
                    : 'Drag & drop a file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPEG, PNG, GIF, WebP (max 3MB)
              </p>
              <button
                type="button"
                onClick={() => setIsYouTube(true)}
                className="mt-4 text-blue-500 hover:text-blue-600"
                disabled={isProcessing}
              >
                Or add a YouTube video
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleYouTubeSubmit} className="space-y-4">
          <div>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube URL here"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsYouTube(false)
                setYoutubeUrl('')
                setError(null)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Add Video
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
