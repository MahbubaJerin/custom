<template>  
<div class = "Signup"> 
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
        <div class="form-group">
        <label for="username">User-name</label>
        <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Sign Up</button>
    </form>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {db, userRef} from '@/firebaseConfig.js';
const username = ref('');
const email = ref('');
const password = ref('');
const error = ref(null);
async function signup() {
    try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        await setDoc(doc(userRef, user.uid), {
            username: username.value,
            email: user.email,
        });
        username.value = "";
        email.value = "";
        password.value = "";
        error.value = null;
        // Redirect to a success page or show a success message
        console.log("User signed up successfully!");
    } catch (e) {
        console.error(e);
        error.value = e.message;
    }
}

</script>

<style scoped>
.Signup {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 300px;
    margin: 0 auto;
}
form {
    display: flex;
    flex-direction: column;
}
</style>