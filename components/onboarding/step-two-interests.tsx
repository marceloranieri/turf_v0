"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// List of available interests
const AVAILABLE_INTERESTS = [
  { id: "technology", name: "Technology" },
  { id: "gaming", name: "Gaming" },
  { id: "sports", name: "Sports" },
  { id: "music", name: "Music" },
  { id: "movies", name: "Movies" },
  { id: "books", name: "Books" },
  { id: "food", name: "Food" },
  { id: "travel", name: "Travel" },
  { id: "fashion", name: "Fashion" },
  { id: "art", name: "Art" },
  { id: "science", name: "Science" },
  { id: "health", name: "Health" },
]

export default function StepTwoInterests({ 
  interests, 
  setInterests, 
  onNext, 
  onBack 
}) {
  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest))
    } else {
      setInterests([...interests, interest])
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Select Your Interests</h2>
        <p className="text-zinc-400 mt-2">
          Choose topics you're interested in to personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {AVAILABLE_INTERESTS.map((interest) => (
          <div
            key={interest.id}
            className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
              interests.includes(interest.id)
                ? "bg-violet-900/50 border border-violet-500"
                : "bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700"
            }`}
            onClick={() => toggleInterest(interest.id)}
          >
            <Checkbox
              checked={interests.includes(interest.id)}
              onCheckedChange={() => toggleInterest(interest.id)}
              className="data-[state=checked]:bg-violet-500"
            />
            <span>{interest.name}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-zinc-700"
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-violet-600 hover:bg-violet-700"
        >
          Next
        </Button>
      </div>
    </div>
  )
} 