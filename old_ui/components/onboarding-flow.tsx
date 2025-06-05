"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useProfile } from "@/context/profile-context"
import { supabase } from "@/lib/supabase"

const CATEGORIES = [
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

export function OnboardingFlow() {
  const router = useRouter()
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [interests, setInterests] = useState<string[]>([])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setAvatarFile(file)
    setAvatarUrl(URL.createObjectURL(file))
  }

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleNext = async () => {
    if (step === 1) {
      if (!username.trim()) {
        toast({
          title: "Username required",
          description: "Please enter a username to continue",
          variant: "destructive",
        })
        return
      }

      // Check if username is available
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .not("id", "eq", user?.id || "")
        .maybeSingle()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to check username availability",
          variant: "destructive",
        })
        return
      }

      if (data) {
        toast({
          title: "Username taken",
          description: "This username is already taken. Please choose another one.",
          variant: "destructive",
        })
        return
      }

      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      if (interests.length === 0) {
        toast({
          title: "Select interests",
          description: "Please select at least one interest to continue",
          variant: "destructive",
        })
        return
      }

      await completeOnboarding()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const completeOnboarding = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Upload avatar if selected
      let avatarPath = null
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile)

        if (uploadError) throw uploadError

        avatarPath = `${supabase.storageUrl}/object/public/avatars/${fileName}`
      }

      // Update profile
      await updateProfile({
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarPath,
      })

      // Save interests
      const { error: interestsError } = await supabase.from("user_interests").upsert(
        interests.map((interest) => ({
          user_id: user.id,
          category: interest,
        })),
      )

      if (interestsError) throw interestsError

      // Mark onboarding as complete
      const { error: settingsError } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        onboarding_completed: true,
      })

      if (settingsError) throw settingsError

      toast({
        title: "Onboarding complete",
        description: "Your profile has been set up successfully!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="h-2 flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-16 rounded-full ${
                    i === step ? "bg-violet-500" : i < step ? "bg-violet-700" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Welcome to Turf!</h2>
                <p className="text-zinc-400 mt-2">Let's set up your profile</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={avatarUrl || profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">{username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>

                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Choose Avatar
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username (required)</Label>
                  <Input
                    id="username"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (optional)</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Tell us about yourself</h2>
                <p className="text-zinc-400 mt-2">Share a bit about who you are</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Write a short bio about yourself"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-zinc-700 border-zinc-600 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Select your interests</h2>
                <p className="text-zinc-400 mt-2">Choose topics you're interested in to personalize your experience</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
                      interests.includes(category.id)
                        ? "bg-violet-900/50 border border-violet-500"
                        : "bg-zinc-700/50 border border-zinc-600 hover:bg-zinc-700"
                    }`}
                    onClick={() => handleInterestToggle(category.id)}
                  >
                    <Checkbox
                      checked={interests.includes(category.id)}
                      onCheckedChange={() => handleInterestToggle(category.id)}
                      className="data-[state=checked]:bg-violet-500"
                    />
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={loading} className="border-zinc-600">
                Back
              </Button>
            ) : (
              <div></div>
            )}

            <Button onClick={handleNext} disabled={loading} className="bg-violet-600 hover:bg-violet-700">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Processing...</span>
                </div>
              ) : step === 3 ? (
                "Complete"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
