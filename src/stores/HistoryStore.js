import { defineStore } from 'pinia'

export const useHistoryStore = defineStore({
  id: 'HistoryStore',

  state: () => ({
    decisions: []
  }),

  getters: {
    sortedDecisions: (state) => {
      return [...state.decisions].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    },

    decisionsByTool: (state) => (tool) => {
      return state.decisions.filter(d => d.tool === tool)
    },

    recentDecisions: (state) => {
      return [...state.decisions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    },

    totalDecisions: (state) => state.decisions.length,

    averageScoreByTool: (state) => (tool) => {
      const toolDecisions = state.decisions.filter(d => d.tool === tool && d.score !== null)
      if (toolDecisions.length === 0) return null
      return Math.round(toolDecisions.reduce((sum, d) => sum + d.score, 0) / toolDecisions.length)
    },

    toolUsageStats: (state) => {
      const stats = {}
      state.decisions.forEach(d => {
        stats[d.tool] = (stats[d.tool] || 0) + 1
      })
      return stats
    }
  },

  actions: {
    addDecision(decision) {
      const newDecision = {
        id: crypto.randomUUID(),
        ...decision,
        createdAt: new Date().toISOString(),
        outcome: null
      }
      this.decisions.push(newDecision)
      this.saveToLocalStorage()
      return newDecision.id
    },

    removeDecision(id) {
      this.decisions = this.decisions.filter(d => d.id !== id)
      this.saveToLocalStorage()
    },

    updateOutcome(id, outcome) {
      const decision = this.decisions.find(d => d.id === id)
      if (decision) {
        decision.outcome = {
          rating: outcome.rating,
          notes: outcome.notes,
          trackedAt: new Date().toISOString()
        }
        this.saveToLocalStorage()
      }
    },

    clearHistory() {
      this.decisions = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('decision-history', JSON.stringify(this.decisions))
      } catch (e) {
        console.error('Failed to save history to localStorage:', e)
      }
    },

    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('decision-history')
        if (saved) {
          this.decisions = JSON.parse(saved)
        }
      } catch (e) {
        console.error('Failed to load history from localStorage:', e)
        this.decisions = []
      }
    }
  }
})

// Tool metadata for display
export const toolMeta = {
  tententen: {
    name: '10-10-10 Rule',
    icon: '&#9200;',
    color: '#3b82f6'
  },
  regret: {
    name: 'Regret Minimization',
    icon: '&#129300;',
    color: '#8b5cf6'
  },
  pmi: {
    name: 'PMI Analysis',
    icon: '&#9878;',
    color: '#10b981'
  },
  swot: {
    name: 'SWOT Analysis',
    icon: '&#127919;',
    color: '#f59e0b'
  },
  opportunityCost: {
    name: 'Opportunity Cost',
    icon: '&#9878;',
    color: '#06b6d4'
  },
  coinFlip: {
    name: 'Coin Flip Test',
    icon: '&#129689;',
    color: '#ec4899'
  },
  fearRegret: {
    name: 'Fear vs Regret',
    icon: '&#128168;',
    color: '#ef4444'
  },
  threeps: {
    name: 'De 3 P\'s',
    icon: '&#128176;',
    color: '#6366f1'
  }
}
