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

                <textarea class="form-control" id="post" v-model="post" required></textarea>
              </div>
              <div class="mb-3">
                <fieldset :disabled="!!uploadTask">
                  <div class=" d-flex align-items-center justify-content-between">
                    <div class="">
                      <button type="button" @click="open({ accept: 'image/*', multiple: false })"
                        class="btn   d-flex align-items-center justify-content-center">
                        <template v-if="files?.length === 1">
                          <div class="selected-file d-flex align-items-center">
                            <span class="file-name" title="{{ files.item(0).name }}">Selected: {{ files.item(0).name
                              }}</span>
                            <span class="file-actions " @click="open({ accept: 'image/*', multiple: false })">
                              Change
                            </span>
                          </div>
                        </template>
                        <template v-else>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="photo-icon"
                            style="width: 24px; height: 24px;">
                            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                              d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                          </svg>
                        </template>
                      </button>
                    </div>
                    <div class="">
                      <button type="submit" class="btn btn-primary">Post</button>
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
  fill: #007bff;
}
</style>
