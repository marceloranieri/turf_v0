export default function OnboardingProgress({ 
  currentStep, 
  totalSteps 
}) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="h-2 flex space-x-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-16 rounded-full ${
              i + 1 === currentStep 
                ? "bg-violet-500" 
                : i + 1 < currentStep 
                  ? "bg-violet-700" 
                  : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  )
} 