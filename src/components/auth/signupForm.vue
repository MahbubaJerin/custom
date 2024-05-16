<template>  
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="Signup"> 
                    <h1 >Sign Up</h1>
                    <form @submit.prevent="signup">
                        <div class="form-group">
                            <label for="username">User-name</label>
                            <input type="text" id="username" v-model="username" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model.lazy="email" @blur="emailTouched = true" required>
                            <p v-if="emailError" class="error">{{ emailError }}</p>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" v-model.lazy="password" @blur="passwordTouched = true" required>
                            <p v-if="passwordError" class="error">{{ passwordError }}</p>
                        </div>
                        <button type="submit" class="btn btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {db, userRef} from '@/firebaseConfig.js';

const username = ref('');
const email = ref('');
const emailTouched = ref(false);
const password = ref('');
const passwordTouched = ref(false);
const error = ref(null);

const emailError = computed(() => {
    if (!emailTouched.value) {
        return null;
    }
    const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!pattern.test(email.value)) {
        return 'Invalid email address';
    }
    return null;
});

const passwordError = computed(() => {
    if (!passwordTouched.value) {
        return null;
    }
    const pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!pattern.test(password.value)) {
        return 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character';
    }
    return null;
});

async function signup() {
    if (emailError.value || passwordError.value) {
        return;
    }
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
        console.log("User signed up successfully!");
    } catch (e) {
        console.error(e);
        error.value = e.message;
    }
}
</script>

<style scoped>
body {
    background-color: #e8f5e9; /* Material Design's 'Green 50' */
}

.Signup h1 {
    text-align: center;
    color: #228B22; /* ForestGreen */
}

.Signup {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    font-size: 1.2em;
    color: #333;
}

.form-group input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
}

.btn-primary {
    background-color: #32CD32; /* LimeGreen */
    border-color: #32CD32; /* LimeGreen */
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: block; /* make the button a block element */
    margin: 0 auto; /* center the button */
}

.btn-primary:hover {
    background-color: #228B22; /* ForestGreen */
}

.error {
    color: #ff0000;
    margin-top: 5px;
}
</style>