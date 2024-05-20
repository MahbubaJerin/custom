<script setup>
import { getAuth } from "firebase/auth";
import { postRef, userRef } from "@/firebaseConfig";
import { ref } from "vue";
import { doc, setDoc, getDoc } from "@firebase/firestore";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { useFileDialog } from "@vueuse/core";
import router from '@/router';

const storage = useFirebaseStorage();
const auth = getAuth();
const uid = auth.currentUser.uid;
const userName = ref('');


const fetchUserName = async () => {
  const docRef = doc(userRef, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    userName.value = docSnap.data().username;
  } else {
    console.log("No such document!");
  }
};
fetchUserName();

const post = ref("");
const image = ref("");
const fileName = ref("");
const { files, open, reset } = useFileDialog();

const createPost = async () => {
  const newPostRef = doc(postRef);
  const postId = newPostRef.id;
  const postPictureRef = storageRef(storage, `postPictures/${postId}`);
  const { upload } = useStorageFile(postPictureRef);
  const data = files.value?.item(0)

  if (data) {
    try {
      fileName.value = data.name;
      await upload(data); // Ensure the upload is complete
      const url = await getDownloadURL(postPictureRef); // Ensure the URL is retrieved
      image.value = url;
      console.log(image.value);
      console.log(uid);
      console.log(userName.value);
      console.log(post.value);

      await setDoc(newPostRef, {
        uid: uid,
        userName: userName.value,
        post: post.value,
        image: image.value,
        likesCount: 0,
        commentsCount: 0,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error creating post with image:", error);
      alert("Error creating post with image. Please try again.");
      return;
    }
  } else {
    try {
      await setDoc(newPostRef, {
        uid: uid,
        userName: userName.value,
        post: post.value,
        image: "",
        likesCount: 0,
        commentsCount: 0,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
      return;
    }
  }

  alert("Post created successfully");
  router.go();
  post.value = "";
  reset(); // Reset the file dialog
};
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card">
          <div class="card-body">

            <form @submit.prevent="createPost">
              <div class="mb-3">

                <textarea class="form-control" id="post" v-model="post" placeholder="Post something about you and your plant story today" required></textarea>
              </div>
              <div class="mb-3">
                <fieldset :disabled="!!uploadTask">
                  <div class=" d-flex align-items-center justify-content-between">
                    <div class="">
                      <button type="button" @click="open({ accept: 'image/*', multiple: false })"
  class="btn d-flex align-items-center justify-content-center">
  <template v-if="files?.length === 1">
    <div class="selected-file d-flex align-items-center">
      <span class="file-name" title="{{ files.item(0).name }}">Selected: {{ files.item(0).name }}</span>
      <span class="file-actions " @click="open({ accept: 'image/*', multiple: false })">Change</span>
    </div>
  </template>
  <template v-else>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="photo-icon" style="width: 24px; height: 24px;">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h16a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2zm3 2a1 1 0 00-1 1v.835a1.42 1.42 0 00.34.977l1.66 1.928c.219.25.555.39.9.39h6a1.5 1.5 0 001-2.732l-1.39-1.61a2.495 2.495 0 00-2-.683H6zm3 4a1 1 0 11-2 0 1 1 0 012 0z"></path>
</svg>
<span>Post a picture</span> <!-- This line will add the text next to the icon -->
</template>
</button>
                    </div>
                    <div class="">
                      <button type="submit" class="btn btn-success btn-dark-green">Post</button>
                    </div>
                  </div>
                </fieldset>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.photo-icon {
  fill: #0ae76d;
}
.btn-dark-green {
  background-color: #006400;
  border-color: #006400;
  color: white;
}
</style>
