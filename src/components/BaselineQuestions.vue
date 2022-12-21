<template>
<div>
<div>
  <p class="text-2xl font-normal leading-normal mt-0 mb-2 text-black-800"> Dit tooltje kan je helpen om te beslissen of je een komend project, 
    kan vanalles zijn, wel of niet moet gaan doen.</p>
  <p class="text-2xl font-normal leading-normal mt-0 mb-2 text-black-800"> Hoe belangrijk zijn Poen, Pret en Prestige in het algemeen voor jou?</p>
 <p class="text-base font-normal leading-normal mt-0 mb-2 text-blue-800">(Schuifje naar rechts betekent belangrijker)</p>
 <div>
  <FormKit type="form" @submit="handleSubmit" submit-label="Verder..">
<FormKit name="werk" v-model="answerStore.baselinepoen" type="range" label="Poen" min="1" max="100"/>
<FormKit name="sociaal" v-model="answerStore.baselinepret" type="range" label="Pret" min="1" max="100"/>
<FormKit name="relatie" v-model="answerStore.baselineprestige" type="range" label="Prestige" min="1" max="100"/>

<FormKit name="project" v-model="answerStore.project" type="textarea" label="Project" rows="1"
  placeholder="Naam van je project.." validation="required" :validation-messages="{
    required: 'Vul een projectnaam in'
  }"/>

</FormKit></div>

</div>
</div>
</template>
<script setup>
// Imports
import { usePStore } from '@/stores/PStore'
import { useRouter } from 'vue-router'

// Connection with the Pinia store
const answerStore = usePStore()
const router = useRouter()

// After submitting the form - use the router
const handleSubmit =  () => {
   router.push('project') // TODO: waarna toe?
    } 
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