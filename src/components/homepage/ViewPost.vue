<script setup>
import { ref } from "vue";
import { postRef } from "@/firebaseConfig";
import { doc, getDocs, updateDoc } from "firebase/firestore";
const likePost = async (id) => {
  const docRef = doc(postRef, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      likes: docSnap.data().likes + 1,
    });
  }
};
var posts = ref([]);
const fetchPosts = async () => {
  const querySnapshot = await getDocs(postRef);
  querySnapshot.forEach((doc) => {
    posts.value.push(doc.data());
  });
};
fetchPosts();
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-body">
            <h1 class="text-center">Posts</h1>
            <div v-for="post in posts" :key="post._id">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{{ post.post }}</h5>
                  <img
                    v-if="post.image"
                    :src="post.image"
                    alt="post"
                    class="img-fluid"
                    :style="{ width: '300px', height: '200px' }"
                  />
                  <p class="card-text">Likes: {{ post.likes }}</p>
                  <p class="card-text">Comments: {{ post.comments }}</p>
                  <p class="card-text">Created At: {{ post.createdAt }}</p>
                </div>
                <div>
                  <button class="btn btn-primary">Like</button>
                  <button class="btn btn-primary">Comment</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
