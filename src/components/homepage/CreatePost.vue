<script setup>
import { getAuth } from "firebase/auth";
import { postRef } from "@/firebaseConfig";
import { ref } from "vue";
import { doc, setDoc } from "@firebase/firestore";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { useFileDialog } from "@vueuse/core";
import { get } from "firebase/database";
const storage = useFirebaseStorage();
const auth = getAuth();
const uid = auth.currentUser.uid;
const post = ref("");
const image = ref("");
const fileName = ref("");
const { files, open, reset } = useFileDialog();
const postPictureRef = storageRef(storage, `postPictures/${uid}`)
const { url, uploadProgress, uploadError, uploadTask, upload } =
  useStorageFile(postPictureRef);
const createPost = async () => {
const data = files.value.item(0);
if (data) {
    fileName.value = data.name;
    upload(data);
    getDownloadURL(postPictureRef).then((url) => {
        image.value = url;
        setDoc(doc(postRef), {
    uid: uid,
    post: post.value,
    image: image.value,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  });
    });
}
else {
    setDoc(doc(postRef), {
        uid: uid,
        post: post.value,
        image: "",
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
    });
}
  alert("Post created successfully");
  post.value = "";
};
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-body">
            <h1 class="text-center">Create Post</h1>
            <form @submit.prevent="createPost">
              <div class="mb-3">
                <label for="post" class="form-label">Post</label>
                <textarea
                  class="form-control"
                  id="post"
                  v-model="post"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <fieldset :disabled="!!uploadTask">
                  <button
                    type="button"
                    @click="open({ accept: 'image/*', multiple: false })"
                    class="btn btn-primary mt-3"
                  >
                    <template v-if="files?.length === 1">
                      <div class="selected-file">
                        <span class="file-name" title="{{ files.item(0).name }}"
                          >Selected : {{ files.item(0).name }}</span
                        >
                        <span
                          class="file-actions"
                          @click="open({ accept: 'image/*', multiple: false })"
                        >
                          Change</span
                        >
                      </div>
                    </template>
                    <template v-else>Add Picture</template>
                  </button>
                </fieldset>
              </div>
              <button type="submit" class="btn btn-primary">Create Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
