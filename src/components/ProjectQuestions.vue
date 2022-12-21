<template>
    <div class="bg-gray-300 border-green-600 border-b p-4 m-4 rounded text-3xl">
    <div class="text-2xl font-normal leading-normal mt-0 mb-2 text-black-800">
      Hoeveel Poen, Pret en Prestige levert {{ answerStore.project }} op?</div>
     <div class="text-base font-normal leading-normal mt-0 mb-2 text-blue-800">(Schuifje naar rechts is belangrijker)</div>
     <div>
      <FormKit type="form" @submit="handleSubmit" submit-label="Verder..">
    <FormKit name="werk" v-model="answerStore.projectpoen" type="range" label="Poen" min="1" max="100"/>
    <FormKit name="sociaal" v-model="answerStore.projectpret" type="range" label="Pret" min="1" max="100"/>
    <FormKit name="relatie" v-model="answerStore.projectprestige" type="range" label="Prestige" min="1" max="100"/>
   
    </FormKit>
    <button @click="back" class="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md mx-2">Terug</button>
    </div>
    </div>
    </template>
    <script setup>
    import { usePStore } from '@/stores/PStore'
    import { useRouter } from 'vue-router'
    
    // Connection with the Pinia store
    const answerStore = usePStore()
    const router = useRouter()
    
    // After submitting the form - use the router
    const handleSubmit =  () => {
       router.push('resultaat') 
        } 
    const back = ()  => {router.push('/')} 
     </script>
                 
    <style>  
      
      [data-type="submit"] .formkit-input {
        
                        display: inline-block;
                        outline: 0;
                        border: 0;
                        cursor: pointer;
                        background-color: #4299e1;
                        border-radius: 4px;
                        padding: 8px 16px;
                        font-size: 16px;
                        font-weight: 700;
                        color: white;
                        line-height: 26px;
      }
    </style>