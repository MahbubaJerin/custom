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
.navbar {
    background-color: #008000; /* This is a dark green color */
}
.nav-link {
    color: #FFD700; /* This is a gold color that should stand out against the green */
}

.nav-link:hover {
    color: #FFA500; /* This is an orange color for when the user hovers over a link */
}
</style>