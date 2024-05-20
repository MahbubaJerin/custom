<template>
    <div class="login grid-container">
        <div class="grid-item">
            <h1>Login</h1>
            <form @submit.prevent="login">
                <div class="grid-item">
                    <input type="email" v-model="email" placeholder="Email" required
                        :class="{ 'is-invalid': emailError }">
                    <p v-if="emailError" class="error">{{ emailError }}</p>
                </div>
                <div class="grid-item">
                    <input type="password" v-model="password" placeholder="Password" required
                        :class="{ 'is-invalid': passwordError }">
                    <p v-if="passwordError" class="error">{{ passwordError }}</p>
                </div>
                <div class="grid-item">
                    <button type="submit">Login</button>
                    <p v-if="error" class="error">{{ error }}</p>
                </div>
                <div class="grid-item">
                    <a href="/signup">Don't have an account? Sign up</a>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref(null);

const emailError = computed(() => {
    const pattern = /^\S+@\S+\.\S+$/;
    return email.value && !pattern.test(email.value) ? 'Invalid email address' : null;
});

async function login() {
    if (emailError.value) {
        return;
    }
    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        console.log(user);
        email.value = "";
        password.value = "";
        error.value = null;

        if (user) {
            window.location.href = '/';
            console.log("User logged in successfully!");
        }

    } catch (err) {
        console.error("Error signing in:", err);
        error.value = "Invalid login details. Please try again.";
    }
}
</script>

<style scoped>
body {
    background-color: #e8f5e9;
    /* Material Design's 'Green 50' */
}

.login {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    justify-content: center;
}

.grid-item {
    margin: 10px;
}

h1 {
    text-align: center;
    color: #228B22;
    /* ForestGreen */
}

input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #32CD32;
    /* LimeGreen */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #228B22;
    /* ForestGreen */
}

.error {
    color: red;
    margin-top: 10px;
    text-align: center;
}
</style>