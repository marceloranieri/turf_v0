"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import StepOneProfile from "./step-one-profile"
import StepTwoInterests from "./step-two-interests"
import StepThreeConnections from "./step-three-connections"
import OnboardingProgress from "./onboarding-progress"

export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "",
    fullName: "",
    bio: "",
    avatarUrl: "",
  })
  const [interests, setInterests] = useState<string[]>([])
  const { user } = useAuth()
  const router = useRouter()

  // Check if user has already completed onboarding
  useEffect(() => {
    if (!user) return

    const checkOnboarding = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single()

      if (data?.onboarding_completed) {
        router.push("/dashboard")
      }
    }

    checkOnboarding()
  }, [user, router])

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      completeOnboarding()
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
      // Update profile
      await supabase.from("profiles").update({
        username: profileData.username,
        full_name: profileData.fullName,
        bio: profileData.bio,
        avatar_url: profileData.avatarUrl,
        onboarding_completed: true,
      }).eq("id", user.id)

      // Save interests
      if (interests.length > 0) {
        const interestsToInsert = interests.map(interest => ({
          user_id: user.id,
          interest_name: interest,
        }))

        await supabase.from("user_interests").insert(interestsToInsert)
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <OnboardingProgress currentStep={step} totalSteps={3} />
          
          {step === 1 && (
            <StepOneProfile 
              profileData={profileData}
              setProfileData={setProfileData}
              onNext={handleNext}
            />
          )}
          
          {step === 2 && (
            <StepTwoInterests
              interests={interests}
              setInterests={setInterests}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {step === 3 && (
            <StepThreeConnections
              onComplete={completeOnboarding}
              onBack={handleBack}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  )
} 