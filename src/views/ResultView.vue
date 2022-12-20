<template>
    <div>
   <div class="bg-green-300 border-green-600 border-b p-4 m-4 rounded text-3xl">Op basis van jouw levensvisie en de waarden voor 
   project "{{ store.project }}", is het advies om dit <b>{{ Advice }}</b> te gaan doen. </div>
    
    <div>
      <!-- TEST   score : {{ store.endScore }}<br> -->
          </div>
    </div>
    </template>
    
    <script setup>
import { usePStore } from '@/stores/PStore'
import { computed } from 'vue'
const store = usePStore()

const Advice = computed (() => {
    if (store.endScore > 6000)
           { return "wel" }
          else { return "niet"} 
})
    </script>
    
  