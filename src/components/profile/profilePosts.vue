<script setup>
import { ref } from "vue";
import { postRef, userRef } from "@/firebaseConfig";
import { doc, getDocs, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const myid = auth.currentUser.uid;
const uid = window.location.pathname.split('/')[2];
const userName = ref('');
const fetchUserName = async () => {
    const docRef = doc(userRef, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        userName.value = docSnap.data().username;
        console.log(userName.value);
    } else {
        console.log("No such document!");
    }
};
fetchUserName();
var posts = ref([]);
const selectedPost = ref(null);
const newComment = ref('');
const fetchPosts = async () => {
    const querySnapshot = await getDocs(postRef);
    querySnapshot.forEach((doc) => {
        if (doc.data().uid === uid) {
            posts.value.push(
                {
                    id: doc.id,
                    userName: doc.data().userName,
                    post: doc.data().post,
                    image: doc.data().image,
                    likesCount: doc.data().likesCount,
                    commentsCount: doc.data().commentsCount,
                    likes: doc.data().likes,
                    comments: doc.data().comments,
                    createdAt: doc.data().createdAt
                }
            );
        }
    });
    console.log(posts.value);
};
fetchPosts();
const dislike = async (postId) => {
    console.log(postId);
    const docRef = doc(postRef, postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const postData = docSnap.data();

        for (let i = 0; i < posts.value.length; i++) {
            if (posts.value[i].id === postId) {
                posts.value[i].likesCount = postData.likesCount - 1;
            }
        }
        await updateDoc(docRef, {
            likesCount: postData.likesCount - 1,
            likes: postData.likes.filter((id) => id !== uid)
        });
    } else {
        console.log("No such document!");
    }

}
const like = async (postId) => {
    console.log(postId);
    const docRef = doc(postRef, postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const postData = docSnap.data();
        if (postData.likes.includes(uid)) {
            await dislike(postId);
            return;
        }

        for (let i = 0; i < posts.value.length; i++) {
            if (posts.value[i].id === postId) {
                posts.value[i].likesCount = postData.likesCount + 1;
            }
        }
        await updateDoc(docRef, {
            likesCount: postData.likesCount + 1,
            likes: [...postData.likes, uid]
        });
    } else {
        console.log("No such document!");
    }
}

const showCommentsModal = async (post) => {
    selectedPost.value = post;
    newComment.value = '';
    // Fetch the latest comments if needed
}

const addComment = async () => {
    if (!newComment.value.trim()) {
        return;
    }
    console.log(userName);
    const postDocRef = doc(postRef, selectedPost.value.id);
    await updateDoc(postDocRef, {
        comments: arrayUnion({ userId: uid, userName: userName.value, comment: newComment.value, timestamp: new Date() }),
        commentsCount: selectedPost.value.commentsCount + 1
    });

    selectedPost.value.comments.push({ userId: uid, userName: userName.value, comment: newComment.value, timestamp: new Date() });
    selectedPost.value.commentsCount++;
    newComment.value = '';
}
</script>
<template>
    <div class="container">


        <div class="modal fade" id="commentsModal" tabindex="-1" aria-labelledby="commentsModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-black" id="commentsModalLabel">Comments</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="selectedPost">
                            <div v-for="comment in selectedPost.comments" :key="comment.timestamp" class="mb-2">
                                <div class="row text-black my-1">
                                    <div class="row">
                                        <h5>{{ comment.userName }}</h5>
                                    </div>

                                    <div class="row">
                                        <p>{{ comment.comment }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <textarea v-model="newComment" class="form-control"
                                placeholder="Add a comment..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="addComment">Add Comment</button>
                    </div>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="card">
                    <div class="card-body">
                        <h1 class="text-center">{{ uid == myid ? "Your Posts" : userName + "'s " + "Posts" }}</h1>
                        <div v-for="post in posts" :key="post._id">
                            <div class="card mb-2">
                                <div class="card-body">
                                    <h5 class="card-title">{{ userName }} posted at {{ post.createdAt }}</h5>
                                    <p>{{ post.post }}</p>
                                    <img v-if="post.image" :src="post.image" alt="post" class="img-fluid"
                                        :style="{ width: '300px', height: '200px' }" />

                                </div>
                                <div class="d-flex align-items-center ms-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="thumbs-up-icon"
                                        @click="like(post.id)">
                                        <path
                                            d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
                                    </svg>
                                    <span class="mx-2">{{ post.likesCount }}</span>

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="comment-icon"
                                        @click="showCommentsModal(post)" data-bs-toggle="modal"
                                        data-bs-target="#commentsModal">
                                        <path
                                            d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
                                    </svg>
                                    <span class="mx-2">{{ post.commentsCount }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scope>
.thumbs-up-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    fill: #FFD700;
}

.comment-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    fill: #007bff;
}
</style>
