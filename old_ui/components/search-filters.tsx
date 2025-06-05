"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Filter, Clock, Activity, Hash, Check } from "lucide-react"

interface SearchFiltersProps {
  onApplyFilters: (filters: any) => void
}

export function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [sortBy, setSortBy] = useState("relevance")
  const [contentTypes, setContentTypes] = useState<string[]>(["posts", "people", "topics"])
  const [timeRange, setTimeRange] = useState("anytime")

  const handleContentTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setContentTypes([...contentTypes, type])
    } else {
      setContentTypes(contentTypes.filter((t) => t !== type))
    }
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      sortBy,
      contentTypes,
      timeRange,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-zinc-800 border-zinc-700 text-zinc-300 shadow-lg px-4"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-zinc-800 border-zinc-700 text-zinc-300 p-4">
        <div className="space-y-4">
          <h3 className="font-medium">Filter search results</h3>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-zinc-400" />
              Sort by
            </h4>
            <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="relevance" id="relevance" />
                <Label htmlFor="relevance" className="text-zinc-300">
                  Relevance
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recent" id="recent" />
                <Label htmlFor="recent" className="text-zinc-300">
                  Most recent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="popular" id="popular" />
                <Label htmlFor="popular" className="text-zinc-300">
                  Most popular
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Hash className="h-4 w-4 mr-2 text-zinc-400" />
              Content type
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="posts"
                  checked={contentTypes.includes("posts")}
                  onCheckedChange={(checked) => handleContentTypeChange("posts", checked as boolean)}
                />
                <Label htmlFor="posts" className="text-zinc-300">
                  Posts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="people"
                  checked={contentTypes.includes("people")}
                  onCheckedChange={(checked) => handleContentTypeChange("people", checked as boolean)}
                />
                <Label htmlFor="people" className="text-zinc-300">
                  People
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topics"
                  checked={contentTypes.includes("topics")}
                  onCheckedChange={(checked) => handleContentTypeChange("topics", checked as boolean)}
                />
                <Label htmlFor="topics" className="text-zinc-300">
                  Topics
                </Label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-zinc-400" />
              Time range
            </h4>
            <RadioGroup value={timeRange} onValueChange={setTimeRange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anytime" id="anytime" />
                <Label htmlFor="anytime" className="text-zinc-300">
                  Anytime
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today" className="text-zinc-300">
                  Today
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week" className="text-zinc-300">
                  This week
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month" className="text-zinc-300">
                  This month
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" onClick={handleApplyFilters}>
            <Check className="h-4 w-4 mr-2" />
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
