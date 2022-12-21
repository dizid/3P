<template>
    <div>
   <div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded text-3xl">Op basis van jouw levensvisie en de waarden voor 
   project "{{ store.project }}", is het advies om dit <b>{{ Advice }}</b> te gaan doen. </div>
    
    <div>
      <!-- TEST   score : {{ store.endScore }}<br> -->
      <button @click="back" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Terug</button>
          </div>
    </div>
    </template>
    
    <script setup>
import { usePStore } from '@/stores/PStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const store = usePStore()

const router = useRouter()
const back = ()  => {router.push('/project')} 

const Advice = computed (() => {
    if (store.endScore > 6000)
           { return "wel" }
          else { return "niet"} 
})
    </script>
    
  