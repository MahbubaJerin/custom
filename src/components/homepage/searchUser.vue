<script setup>
import { ref } from "vue";
import { userRef } from "@/firebaseConfig";
import { doc, getDocs, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const uid = auth.currentUser.uid;
const name = ref('');
const suggestions = ref([]);

const searchUser = async (name) => {
    if(name===''){
        suggestions.value = [];
        return;
    }
    const querySnapshot = await getDocs(userRef);
    const matchedUsers = [];
    querySnapshot.forEach((doc) => {
        if (doc.data().username.toLowerCase().includes(name.toLowerCase())) {
            matchedUsers.push(
                {
                    id: doc.id,
                    userName: doc.data().username,

                }

            );
        }
    });
    suggestions.value = matchedUsers.slice(0, 3);
};

const handleSuggestionClick = (userId) => {
    window.location.href = `/profile/${userId}`;
};
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="card">
                    <div class="card-header">Search User</div>
                    <div class="card-body">
                        <input type="text" class="form-control" placeholder="Search User" v-model="name"
                            @input="searchUser(name)">
                        <div v-if="suggestions.length > 0">
                            <ul>
                                <li v-for="suggestion in suggestions" :key="suggestion" class="text-white"
                                    @click="handleSuggestionClick(suggestion.id)"
                                    @mouseenter="highlightSuggestion"
                                    @mouseleave="removeHighlight">
                                    
                                        {{ suggestion.userName }}
                                    
                                </li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
   background-color: rgb(55, 165, 104);
   color: white;
}
.card-header {
   font-weight: bold;
}
.text-white:hover {
    cursor: pointer;
    text-decoration: underline; /* Add underline when hovering */
}
</style>
