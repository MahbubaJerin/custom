<script setup>
import CreatePost from '../../components/homepage/CreatePost.vue';
import SearchUser from '../../components/homepage/searchUser.vue';
import ViewPost from '../../components/homepage/ViewPost.vue';
</script>
<template>
  <main>
    <div>
      <SearchUser />
    </div>
    <div>
      <CreatePost />
    </div>
    <div>
      <ViewPost />
    </div>
  </main>
</template>