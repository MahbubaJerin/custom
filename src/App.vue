<script setup>
import { RouterLink, RouterView } from 'vue-router'
import navBar from '@/components/navigation/navBar.vue'
</script>

<template>
 <div> 
    <navBar/>

<div class=" m-3">
  <RouterView />
</div>
</div>
</template>

<style scoped>

</style>
