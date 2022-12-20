import { defineStore } from 'pinia'

export const usePStore = defineStore({
  id: 'PStore',
  state: () => ({  // Default values - or not?
    baselinepoen: '',
    baselinepret: '',
    baselineprestige: '',
    project: '',
    projectpoen: '',
    projectpret: '',
    projectprestige: '',

  }),
})
