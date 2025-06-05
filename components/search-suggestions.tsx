"use client"

import { useState, useEffect } from "react"

interface SearchSuggestionsProps {
  searchQuery: string
  onSelectSuggestion: (suggestion: string) => void
}

export function SearchSuggestions({ searchQuery, onSelectSuggestion }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "UI design trends",
    "React hooks",
    "Product management",
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would call the API with the search query
        // const response = await fetch(`/api/search?q=${searchQuery}`)
        // const data = await response.json()
        // setSuggestions(data.suggestions)

        // For demo purposes, we'll use mock data
        const mockSuggestions = [
          `${searchQuery} trends`,
          `${searchQuery} best practices`,
          `${searchQuery} tutorial`,
          `${searchQuery} examples`,
        ]
        setTimeout(() => {
          setSuggestions(mockSuggestions)
          setIsLoading(false)
        }, 300)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [searchQuery])

  const handleSelectSuggestion = (suggestion: string) => {
    onSelectSuggestion(suggestion)
    // Add to recent searches if not already present
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches([suggestion, ...recentSearches.slice(0, 2)])
    }
  }

  if (searchQuery.length < 2 && recentSearches.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 rounded-lg border border-zinc-700 shadow-lg z-20">
      {searchQuery.length < 2 ? (
        <div className="p-2">
          <div className="flex items-center px-3 py-2 text-sm text-zinc-400">
            <Clock className="h-4 w-4 mr-2" />
            <span>Recent searches</span>
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              className="flex items-center w-full px-3 py-2 hover:bg-zinc-700/50 rounded-md text-left text-zinc-300"
              onClick={() => handleSelectSuggestion(search)}
            >
              <Clock className="h-4 w-4 mr-2 text-zinc-500" />
              <span>{search}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-500"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center px-3 py-2 text-sm text-zinc-400">
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="flex items-center w-full px-3 py-2 hover:bg-zinc-700/50 rounded-md text-left text-zinc-300"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <Search className="h-4 w-4 mr-2 text-zinc-500" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
