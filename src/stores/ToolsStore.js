import { defineStore } from 'pinia'

export const useToolsStore = defineStore({
  id: 'ToolsStore',

  state: () => ({
    // 10-10-10 Rule State
    tententen: {
      decision: '',
      feel10min: 50,
      feel10months: 50,
      feel10years: 50
    },

    // Regret Minimization State
    regret: {
      decision: '',
      regretNotTrying: 50,
      reversibility: 50,
      valueAlignment: 50,
      age80Perspective: 50
    },

    // PMI Analysis State
    pmi: {
      decision: '',
      plusItems: [],
      minusItems: [],
      interestingItems: [],
      nextId: 1
    }
  }),

  getters: {
    // 10-10-10 Score (weighted towards long-term)
    tententenScore: (state) => {
      return Math.round(
        (state.tententen.feel10min * 0.15) +
        (state.tententen.feel10months * 0.35) +
        (state.tententen.feel10years * 0.50)
      )
    },

    tententenAdvice: (state) => {
      const score = Math.round(
        (state.tententen.feel10min * 0.15) +
        (state.tententen.feel10months * 0.35) +
        (state.tententen.feel10years * 0.50)
      )
      if (score >= 60) return { text: 'Go for it!', type: 'positive' }
      if (score >= 40) return { text: 'Consider carefully', type: 'neutral' }
      return { text: 'Probably not', type: 'negative' }
    },

    // Regret Minimization Score
    regretScore: (state) => {
      return Math.round(
        (state.regret.regretNotTrying * 0.40) +
        (state.regret.reversibility * 0.15) +
        (state.regret.valueAlignment * 0.25) +
        (state.regret.age80Perspective * 0.20)
      )
    },

    regretAdvice: (state) => {
      const score = Math.round(
        (state.regret.regretNotTrying * 0.40) +
        (state.regret.reversibility * 0.15) +
        (state.regret.valueAlignment * 0.25) +
        (state.regret.age80Perspective * 0.20)
      )
      if (score >= 65) return { text: 'Take the leap!', type: 'positive' }
      if (score >= 45) return { text: 'Proceed with caution', type: 'neutral' }
      return { text: 'Maybe not right now', type: 'negative' }
    },

    // PMI Scores
    pmiPlusScore: (state) => {
      return state.pmi.plusItems
        .filter(item => item.text.trim())
        .reduce((sum, item) => sum + item.weight, 0)
    },

    pmiMinusScore: (state) => {
      return state.pmi.minusItems
        .filter(item => item.text.trim())
        .reduce((sum, item) => sum + item.weight, 0)
    },

    pmiInterestingScore: (state) => {
      return state.pmi.interestingItems
        .filter(item => item.text.trim())
        .reduce((sum, item) => sum + (item.weight * 0.5), 0)
    },

    pmiNetScore() {
      return Math.round(this.pmiPlusScore - this.pmiMinusScore + this.pmiInterestingScore)
    },

    pmiAdvice() {
      const net = this.pmiNetScore
      if (net >= 10) return { text: 'Strong go!', type: 'positive' }
      if (net >= 3) return { text: 'Leaning positive', type: 'positive' }
      if (net >= -3) return { text: 'Needs more thought', type: 'neutral' }
      if (net >= -10) return { text: 'Leaning negative', type: 'negative' }
      return { text: 'Strong no', type: 'negative' }
    }
  },

  actions: {
    // 10-10-10 Reset
    resetTententen() {
      this.tententen = {
        decision: '',
        feel10min: 50,
        feel10months: 50,
        feel10years: 50
      }
    },

    // Regret Reset
    resetRegret() {
      this.regret = {
        decision: '',
        regretNotTrying: 50,
        reversibility: 50,
        valueAlignment: 50,
        age80Perspective: 50
      }
    },

    // PMI Actions
    addPlusItem() {
      this.pmi.plusItems.push({ id: this.pmi.nextId++, text: '', weight: 5 })
    },

    addMinusItem() {
      this.pmi.minusItems.push({ id: this.pmi.nextId++, text: '', weight: 5 })
    },

    addInterestingItem() {
      this.pmi.interestingItems.push({ id: this.pmi.nextId++, text: '', weight: 5 })
    },

    removePlusItem(id) {
      this.pmi.plusItems = this.pmi.plusItems.filter(item => item.id !== id)
    },

    removeMinusItem(id) {
      this.pmi.minusItems = this.pmi.minusItems.filter(item => item.id !== id)
    },

    removeInterestingItem(id) {
      this.pmi.interestingItems = this.pmi.interestingItems.filter(item => item.id !== id)
    },

    resetPmi() {
      this.pmi = {
        decision: '',
        plusItems: [],
        minusItems: [],
        interestingItems: [],
        nextId: 1
      }
    }
  }
})
