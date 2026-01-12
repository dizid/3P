/**
 * AI Service - Placeholder for AI-powered advice
 *
 * In production, these functions would call your backend API
 * which then interacts with OpenAI, Anthropic, or similar.
 *
 * Environment variables needed:
 * - VITE_API_URL
 * - VITE_AI_ENABLED (set to 'true' to enable)
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://api.de3ps.nl'
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED === 'true'

export const aiService = {
  /**
   * Check if AI features are enabled
   */
  isEnabled() {
    return AI_ENABLED
  },

  /**
   * Get AI-generated summary and insights for a decision analysis
   * @param {string} tool - Tool ID (e.g., 'tententen', 'pmi')
   * @param {object} data - Tool-specific data
   * @returns {Promise<{summary: string, insights: string[], blindSpots: string[], suggestions: string[]}>}
   */
  async getAnalysisSummary(tool, data) {
    if (!AI_ENABLED) {
      return this.getPlaceholderSummary(tool, data)
    }

    // In production, would call backend:
    // const response = await fetch(`${API_URL}/ai/summary`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tool, data })
    // })
    // return response.json()

    return this.getPlaceholderSummary(tool, data)
  },

  /**
   * Get interactive AI guidance / chat-style advice
   * @param {string} tool - Tool ID
   * @param {object} data - Tool-specific data
   * @param {string} prompt - User's question or request
   * @returns {Promise<{response: string, followUps: string[]}>}
   */
  async getGuidance(tool, data, prompt) {
    if (!AI_ENABLED) {
      return {
        response: 'AI guidance is coming soon! In the meantime, take a moment to reflect on your analysis and trust your instincts.',
        followUps: [
          'What aspects of this decision feel most uncertain?',
          'Have you faced similar decisions before?',
          'What would you advise a friend in this situation?'
        ]
      }
    }

    // In production, would call backend
    return {
      response: 'AI guidance will be available soon.',
      followUps: []
    }
  },

  /**
   * Generate placeholder summary based on tool type
   */
  getPlaceholderSummary(tool, data) {
    const toolSummaries = {
      tententen: {
        summary: 'Your time-based analysis shows how your feelings evolve across different horizons. Pay attention to where immediate reactions differ from long-term outlook.',
        insights: [
          'Long-term perspective is weighted highest (50%)',
          'Consider if short-term discomfort is worth long-term gain',
          'Time often provides clarity that emotions obscure'
        ],
        blindSpots: [
          'Are you overweighting current mood?',
          'Have you considered how external factors might change?'
        ],
        suggestions: [
          'Sleep on it before committing',
          'Discuss with someone who knows you well'
        ]
      },
      pmi: {
        summary: 'Your Plus-Minus-Interesting analysis provides a structured view of the decision landscape. The "Interesting" category often reveals overlooked opportunities.',
        insights: [
          'Balance of weighted pros and cons matters most',
          'Interesting points can tip the scales',
          'Quality of points matters more than quantity'
        ],
        blindSpots: [
          'Are there stakeholders you haven\'t considered?',
          'What are you assuming that might not be true?'
        ],
        suggestions: [
          'Re-examine your top "Interesting" items',
          'Consider the reversibility of each factor'
        ]
      },
      regret: {
        summary: 'Regret minimization focuses on your future self\'s perspective. At 80, will you regret not trying more than trying and failing?',
        insights: [
          'Regrets of inaction often outweigh regrets of action',
          'Reversible decisions carry less risk',
          'Value alignment is key for lasting satisfaction'
        ],
        blindSpots: [
          'Are you letting fear masquerade as wisdom?',
          'Is your comfort zone holding you back?'
        ],
        suggestions: [
          'Imagine explaining your choice to your 80-year-old self',
          'Consider: what would you attempt if you knew you couldn\'t fail?'
        ]
      },
      threeps: {
        summary: 'Your 3 P\'s analysis shows how well this project aligns with your personal values of Money, Fun, and Prestige.',
        insights: [
          'A mismatch in any P can lead to dissatisfaction',
          'Your baseline values reveal what truly matters to you',
          'High scores mean strong alignment, not guaranteed success'
        ],
        blindSpots: [
          'Are your baseline values honest or aspirational?',
          'Could this project change what you value?'
        ],
        suggestions: [
          'Compare with a past project that felt right',
          'Consider which P you\'d be willing to compromise on'
        ]
      }
    }

    // Default summary for tools not specifically handled
    const defaultSummary = {
      summary: 'Your analysis provides valuable structured thinking about this decision. Take time to reflect on the patterns that emerge.',
      insights: [
        'Structured analysis often reveals hidden assumptions',
        'Your gut reaction after analysis is valuable data',
        'No framework captures everything - trust your judgment'
      ],
      blindSpots: [
        'What are you not seeing?',
        'Who else might have perspective on this?'
      ],
      suggestions: [
        'Give yourself time before deciding',
        'Consider trying a different tool for comparison'
      ]
    }

    return toolSummaries[tool] || defaultSummary
  }
}

export default aiService
