"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (query: string, filters: string[]) => void
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<string[]>([])

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const handleClear = () => {
    setQuery("")
    setFilters([])
    onSearch("", [])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        {(query || filters.length > 0) && (
          <Button variant="outline" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

export { SearchFilters as default };
