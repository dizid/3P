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
    },

    // SWOT Analysis State
    swot: {
      decision: '',
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      nextId: 1
    },

    // Opportunity Cost State
    opportunityCost: {
      decision: '',
      optionAName: 'Do it',
      optionBName: "Don't do it",
      gains: [],
      sacrifices: [],
      nextId: 1
    },

    // Coin Flip State
    coinFlip: {
      decision: '',
      optionA: '',
      optionB: '',
      result: null,
      reaction: null
    },

    // Fear vs Regret State
    fearRegret: {
      decision: '',
      fearsOfAction: [],
      fearsOfInaction: [],
      nextId: 1
    },

    // De 3 P's State
    threeps: {
      baselinePoen: 50,
      baselinePret: 50,
      baselinePrestige: 50,
      project: '',
      projectPoen: 50,
      projectPret: 50,
      projectPrestige: 50,
      currentStep: 1  // 1=baseline, 2=project, 3=result
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
    },

    // SWOT Scores
    swotStrengthsScore: (state) => {
      return state.swot.strengths.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    swotWeaknessesScore: (state) => {
      return state.swot.weaknesses.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    swotOpportunitiesScore: (state) => {
      return state.swot.opportunities.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    swotThreatsScore: (state) => {
      return state.swot.threats.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    swotInternalScore() {
      return this.swotStrengthsScore - this.swotWeaknessesScore
    },
    swotExternalScore() {
      return this.swotOpportunitiesScore - this.swotThreatsScore
    },
    swotOverallScore() {
      return this.swotInternalScore + this.swotExternalScore
    },
    swotAdvice() {
      const score = this.swotOverallScore
      if (score >= 15) return { text: 'Strong position!', type: 'positive' }
      if (score >= 5) return { text: 'Favorable outlook', type: 'positive' }
      if (score >= -5) return { text: 'Mixed signals', type: 'neutral' }
      if (score >= -15) return { text: 'Challenging position', type: 'negative' }
      return { text: 'Significant concerns', type: 'negative' }
    },

    // Opportunity Cost Scores
    opportunityGainsScore: (state) => {
      return state.opportunityCost.gains.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    opportunitySacrificesScore: (state) => {
      return state.opportunityCost.sacrifices.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    opportunityNetScore() {
      return this.opportunityGainsScore - this.opportunitySacrificesScore
    },
    opportunityAdvice() {
      const net = this.opportunityNetScore
      if (net >= 10) return { text: 'Worth the trade-off!', type: 'positive' }
      if (net >= 3) return { text: 'Gains outweigh costs', type: 'positive' }
      if (net >= -3) return { text: 'Break even', type: 'neutral' }
      if (net >= -10) return { text: 'Costs outweigh gains', type: 'negative' }
      return { text: 'Not worth it', type: 'negative' }
    },

    // Coin Flip Advice
    coinFlipAdvice: (state) => {
      const { result, reaction } = state.coinFlip
      if (!result || !reaction) return null

      if (reaction === 'relieved') {
        return { text: `Go with ${result === 'A' ? state.coinFlip.optionA : state.coinFlip.optionB}!`, type: 'positive' }
      } else if (reaction === 'disappointed') {
        return { text: `Go with ${result === 'A' ? state.coinFlip.optionB : state.coinFlip.optionA}!`, type: 'positive' }
      }
      return { text: 'Your gut has no strong preference', type: 'neutral' }
    },

    // Fear vs Regret Scores
    fearOfActionScore: (state) => {
      return state.fearRegret.fearsOfAction.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    fearOfInactionScore: (state) => {
      return state.fearRegret.fearsOfInaction.filter(i => i.text.trim()).reduce((sum, i) => sum + i.weight, 0)
    },
    fearNetScore() {
      return this.fearOfInactionScore - this.fearOfActionScore
    },
    fearAdvice() {
      const net = this.fearNetScore
      if (net >= 10) return { text: 'Act! Fear of regret is stronger', type: 'positive' }
      if (net >= 3) return { text: 'Lean towards action', type: 'positive' }
      if (net >= -3) return { text: 'Fears are balanced', type: 'neutral' }
      if (net >= -10) return { text: 'Lean towards caution', type: 'negative' }
      return { text: 'Wait - fear of action dominates', type: 'negative' }
    },

    // De 3 P's Score (multiplicative comparison)
    threepsScore: (state) => {
      return (state.threeps.baselinePoen * state.threeps.projectPoen) +
             (state.threeps.baselinePret * state.threeps.projectPret) +
             (state.threeps.baselinePrestige * state.threeps.projectPrestige)
    },

    threepsAdvice() {
      const score = this.threepsScore
      if (score >= 7500) return { text: 'Ga ervoor!', type: 'positive' }
      if (score >= 6000) return { text: 'Ziet er goed uit', type: 'positive' }
      if (score >= 4500) return { text: 'Overweeg goed', type: 'neutral' }
      return { text: 'Wellicht niet', type: 'negative' }
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
    },

    // SWOT Actions
    addStrength() {
      this.swot.strengths.push({ id: this.swot.nextId++, text: '', weight: 5 })
    },
    addWeakness() {
      this.swot.weaknesses.push({ id: this.swot.nextId++, text: '', weight: 5 })
    },
    addOpportunity() {
      this.swot.opportunities.push({ id: this.swot.nextId++, text: '', weight: 5 })
    },
    addThreat() {
      this.swot.threats.push({ id: this.swot.nextId++, text: '', weight: 5 })
    },
    removeStrength(id) {
      this.swot.strengths = this.swot.strengths.filter(item => item.id !== id)
    },
    removeWeakness(id) {
      this.swot.weaknesses = this.swot.weaknesses.filter(item => item.id !== id)
    },
    removeOpportunity(id) {
      this.swot.opportunities = this.swot.opportunities.filter(item => item.id !== id)
    },
    removeThreat(id) {
      this.swot.threats = this.swot.threats.filter(item => item.id !== id)
    },
    resetSwot() {
      this.swot = {
        decision: '',
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        nextId: 1
      }
    },

    // Opportunity Cost Actions
    addGain() {
      this.opportunityCost.gains.push({ id: this.opportunityCost.nextId++, text: '', weight: 5 })
    },
    addSacrifice() {
      this.opportunityCost.sacrifices.push({ id: this.opportunityCost.nextId++, text: '', weight: 5 })
    },
    removeGain(id) {
      this.opportunityCost.gains = this.opportunityCost.gains.filter(item => item.id !== id)
    },
    removeSacrifice(id) {
      this.opportunityCost.sacrifices = this.opportunityCost.sacrifices.filter(item => item.id !== id)
    },
    resetOpportunityCost() {
      this.opportunityCost = {
        decision: '',
        optionAName: 'Do it',
        optionBName: "Don't do it",
        gains: [],
        sacrifices: [],
        nextId: 1
      }
    },

    // Coin Flip Actions
    flipCoin() {
      this.coinFlip.result = Math.random() < 0.5 ? 'A' : 'B'
      this.coinFlip.reaction = null
    },
    setReaction(reaction) {
      this.coinFlip.reaction = reaction
    },
    resetCoinFlip() {
      this.coinFlip = {
        decision: '',
        optionA: '',
        optionB: '',
        result: null,
        reaction: null
      }
    },

    // Fear vs Regret Actions
    addFearOfAction() {
      this.fearRegret.fearsOfAction.push({ id: this.fearRegret.nextId++, text: '', weight: 5 })
    },
    addFearOfInaction() {
      this.fearRegret.fearsOfInaction.push({ id: this.fearRegret.nextId++, text: '', weight: 5 })
    },
    removeFearOfAction(id) {
      this.fearRegret.fearsOfAction = this.fearRegret.fearsOfAction.filter(item => item.id !== id)
    },
    removeFearOfInaction(id) {
      this.fearRegret.fearsOfInaction = this.fearRegret.fearsOfInaction.filter(item => item.id !== id)
    },
    resetFearRegret() {
      this.fearRegret = {
        decision: '',
        fearsOfAction: [],
        fearsOfInaction: [],
        nextId: 1
      }
    },

    // De 3 P's Actions
    setThreepsStep(step) {
      this.threeps.currentStep = step
    },

    resetThreeps() {
      this.threeps = {
        baselinePoen: 50,
        baselinePret: 50,
        baselinePrestige: 50,
        project: '',
        projectPoen: 50,
        projectPret: 50,
        projectPrestige: 50,
        currentStep: 1
      }
    }
  }
})
