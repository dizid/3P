/**
 * AI Service - Real AI-powered advice using Claude API
 *
 * Calls Netlify Function which connects to Anthropic's Claude API
 * for personalized decision analysis.
 *
 * Tiered responses:
 * - Free: Basic insight, blind spots, next step (1/month, Haiku)
 * - Pro: Full coaching analysis with biases, scenarios, questions (unlimited, Sonnet)
 */

const API_BASE = import.meta.env.DEV ? 'http://localhost:8888' : ''
const API_KEY = import.meta.env.VITE_APP_API_KEY || ''

// Get auth token for server-side subscription verification
const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
  const token = localStorage.getItem('auth_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const aiService = {
  /**
   * Check if AI features are enabled
   */
  isEnabled() {
    return true
  },

  /**
   * Get AI-generated analysis for a decision
   */
  async getAnalysisSummary(tool, data, decision = '', score = null) {
    try {
      const response = await fetch(`${API_BASE}/api/analyze-decision`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tool,
          data,
          decision: decision || data.decision || 'This decision',
          score
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('AI analysis failed:', error)

        // Handle rate limit
        if (response.status === 429) {
          return {
            error: true,
            rateLimited: true,
            message: error.message,
            resetDate: error.resetDate,
            upgradeUrl: error.upgradeUrl
          }
        }

        return this.getFallbackSummary(tool)
      }

      const result = await response.json()

      if (result.success && result.analysis) {
        return this.transformAnalysis(result.analysis, result.plan, result.remaining, result.resetDate)
      }

      return this.getFallbackSummary(tool)
    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackSummary(tool)
    }
  },

  /**
   * Transform analysis based on tier
   */
  transformAnalysis(analysis, plan, remaining, resetDate) {
    const base = {
      isReal: true,
      plan,
      remaining,
      resetDate
    }

    if (plan === 'pro') {
      // Pro tier — full coaching analysis
      return {
        ...base,
        summary: analysis.coreInsight || analysis.insight,
        insights: analysis.blindSpots || [],
        blindSpots: analysis.blindSpots || [],
        suggestions: [analysis.nextStep],
        confidence: analysis.confidence?.level || analysis.confidence || 'medium',
        // Pro-specific fields
        biases: analysis.biases || [],
        scenarios: analysis.scenarios || null,
        frameworkFit: analysis.frameworkFit || null,
        clarityScore: analysis.clarityScore || null,
        confidenceMissing: analysis.confidence?.missing || [],
        questions: analysis.questions || []
      }
    }

    // Free tier — basic analysis
    return {
      ...base,
      summary: analysis.insight,
      insights: analysis.blindSpots || [],
      blindSpots: analysis.blindSpots || [],
      suggestions: [analysis.nextStep],
      confidence: analysis.confidence || 'medium'
    }
  },

  /**
   * Get interactive AI guidance
   */
  async getGuidance(tool, data, prompt) {
    try {
      const response = await fetch(`${API_BASE}/api/analyze-decision`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tool,
          data,
          decision: prompt,
          isGuidance: true
        })
      })

      if (!response.ok) {
        return this.getFallbackGuidance()
      }

      const result = await response.json()

      if (result.success && result.analysis) {
        return {
          response: result.analysis.coreInsight || result.analysis.insight,
          followUps: result.analysis.questions || result.analysis.blindSpots || [],
          isReal: true
        }
      }

      return this.getFallbackGuidance()
    } catch (error) {
      console.error('AI guidance error:', error)
      return this.getFallbackGuidance()
    }
  },

  /**
   * Fallback when AI is unavailable
   */
  getFallbackSummary(tool) {
    const toolSummaries = {
      tententen: {
        summary: 'Your time-based analysis shows how feelings evolve across horizons.',
        insights: ['Long-term perspective weighted highest (50%)'],
        blindSpots: ['Consider how external factors might change'],
        suggestions: ['Sleep on it before committing'],
        confidence: 'low',
        isReal: false
      },
      pmi: {
        summary: 'Your PMI analysis provides structured decision landscape view.',
        insights: ['Quality of points matters more than quantity'],
        blindSpots: ['Are there stakeholders you haven\'t considered?'],
        suggestions: ['Re-examine your top "Interesting" items'],
        confidence: 'low',
        isReal: false
      },
      regret: {
        summary: 'Regret minimization focuses on your future self\'s perspective.',
        insights: ['Regrets of inaction often outweigh action regrets'],
        blindSpots: ['Are you letting fear masquerade as wisdom?'],
        suggestions: ['Imagine explaining this to your 80-year-old self'],
        confidence: 'low',
        isReal: false
      },
      threeps: {
        summary: 'Your 3 P\'s shows alignment with Money, Fun, and Prestige values.',
        insights: ['A mismatch in any P can lead to dissatisfaction'],
        blindSpots: ['Are your baseline values honest or aspirational?'],
        suggestions: ['Compare with a past project that felt right'],
        confidence: 'low',
        isReal: false
      },
      swot: {
        summary: 'Your SWOT analysis reveals strategic positioning.',
        insights: ['Opportunities often come from addressing weaknesses'],
        blindSpots: ['Are you underestimating external threats?'],
        suggestions: ['Focus on leveraging strengths against opportunities'],
        confidence: 'low',
        isReal: false
      },
      coinflip: {
        summary: 'Your gut reaction to the coin flip reveals your true preference.',
        insights: ['First reactions often reflect deep preferences'],
        blindSpots: ['Is fear influencing your reaction?'],
        suggestions: ['Trust the feeling, not the coin'],
        confidence: 'medium',
        isReal: false
      },
      fearRegret: {
        summary: 'The fear/regret matrix clarifies your emotional landscape.',
        insights: ['High regret + low fear = clear action signal'],
        blindSpots: ['Are your fears based on evidence or assumption?'],
        suggestions: ['List specific actions to address each fear'],
        confidence: 'low',
        isReal: false
      },
      opportunityCost: {
        summary: 'Opportunity cost reveals what you truly sacrifice.',
        insights: ['Every choice eliminates other possibilities'],
        blindSpots: ['Are there options you haven\'t considered?'],
        suggestions: ['Consider the hidden costs of inaction'],
        confidence: 'low',
        isReal: false
      }
    }

    return toolSummaries[tool] || {
      summary: 'Analysis helps structure your thinking.',
      insights: ['Structured analysis reveals hidden assumptions'],
      blindSpots: ['What are you not seeing?'],
      suggestions: ['Give yourself time before deciding'],
      confidence: 'low',
      isReal: false
    }
  },

  /**
   * Fallback guidance when AI is unavailable
   */
  getFallbackGuidance() {
    return {
      response: 'AI guidance is temporarily unavailable. Trust your analysis and instincts.',
      followUps: [
        'What aspects feel most uncertain?',
        'Have you faced similar decisions before?',
        'What would you advise a friend?'
      ],
      isReal: false
    }
  }
}

export default aiService
