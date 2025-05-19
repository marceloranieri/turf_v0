"use client"

import { useState } from "react"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"

export default function ImportDebateTopicsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setMessage(null) // Clear any previous messages
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/import-debate-topics", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          text: data.message || "Topics imported successfully",
          type: "success",
        })
        setFile(null)
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setMessage({
          text: data.error || "Failed to import topics",
          type: "error",
        })
      }
    } catch (error) {
      setMessage({
        text: "An unexpected error occurred",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Import Debate Topics</h1>

        <div className="bg-card rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload CSV File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV file only</p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Expected CSV Format</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>The CSV file should include the following columns:</p>
                <ul className="list-disc list-inside">
                  <li>title (required)</li>
                  <li>question (required)</li>
                  <li>category (required)</li>
                  <li>description (optional)</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white transition-colors ${
                !file || loading
                  ? "bg-muted cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                "Import Topics"
              )}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-4 rounded-md flex items-start space-x-2 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 