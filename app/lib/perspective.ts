interface PerspectiveResponse {
  toxicity: number
  severe_toxicity: number
  identity_attack: number
  [key: string]: number
}

const TOXICITY_THRESHOLDS = {
  TOXICITY: 0.75,
  SEVERE_TOXICITY: 0.65,
  IDENTITY_ATTACK: 0.60
}

export async function analyzeWithPerspective(text: string): Promise<PerspectiveResponse> {
  const response = await fetch('/api/perspective', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error('Failed to analyze text')
  }

  return response.json()
}

export function isToxic(scores: PerspectiveResponse): boolean {
  return (
    scores.toxicity > TOXICITY_THRESHOLDS.TOXICITY ||
    scores.severe_toxicity > TOXICITY_THRESHOLDS.SEVERE_TOXICITY ||
    scores.identity_attack > TOXICITY_THRESHOLDS.IDENTITY_ATTACK
  )
}

export function getToxicityReason(scores: PerspectiveResponse): string {
  const reasons = []
  
  if (scores.toxicity > TOXICITY_THRESHOLDS.TOXICITY) {
    reasons.push('Toxic language')
  }
  if (scores.severe_toxicity > TOXICITY_THRESHOLDS.SEVERE_TOXICITY) {
    reasons.push('Severe toxicity')
  }
  if (scores.identity_attack > TOXICITY_THRESHOLDS.IDENTITY_ATTACK) {
    reasons.push('Identity attack')
  }

  return reasons.join(', ')
}
