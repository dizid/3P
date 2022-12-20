import { defineStore } from 'pinia'

export const usePStore = defineStore({
  id: 'PStore',
  state: () => ({
    baselinepoen: '50',
    baselinepret: '50',
    baselineprestige: '50',
    project: '',
    projectpoen: '50',
    projectpret: '50',
    projectprestige: '50',

  }),

  getters: {
    endScore: (state) =>
      (state.baselinepoen * state.projectpoen) +
      (state.baselinepret * state.projectpret) +
      (state.baselineprestige * state.projectprestige),

    // Above getter WORKS but when i add 2nd getter (below) i get: endScore: undefined error

    /*     endAdvice() {
          if (endScore > 6000)
            return "wel"
          // else return "niet"
        }, */
  },

})
