const API_KEY = process.env.PERSPECTIVE_API_KEY

export async function checkToxicity(text: string): Promise<boolean> {
  if (!API_KEY) {
    console.warn('PERSPECTIVE_API_KEY not set, skipping toxicity check')
    return true
  }

  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        comment: { text },
        languages: ["en"],
        requestedAttributes: { TOXICITY: {} },
      }),
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      console.error('Perspective API error:', await response.text())
      return true // Allow message if API fails
    }

    const result = await response.json()
    const score = result.attributeScores.TOXICITY.summaryScore.value
    return score < 0.75 // Reject if higher
  } catch (error) {
    console.error('Error checking toxicity:', error)
    return true // Allow message if check fails
  }
}
