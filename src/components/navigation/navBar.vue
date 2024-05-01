<script setup>
import { signOut, getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";

const auth = getAuth();
const router = useRouter();

// Initialize loading state and fetch the current user
const loading = true; // You can handle loading state based on getCurrentUser() promise
const user = useCurrentUser();

const handleLogout = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully!");
        setTimeout(() => {
            location.reload();
        }, 1000);
    } catch (error) {
        console.error("Error signing out:", error);
    }
};
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-dark " data-bs-theme="dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li v-if="user" class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                    </li>
                    <li v-if="!user" class="nav-item">
                        <a class="nav-link" href="/signup">Signup</a>
                    </li>
                    <li v-if="!user" class="nav-item">
                        <a class="nav-link" href="/login">Login</a>
                    </li>
                </ul>
                <button v-if="user" @click="handleLogout" class="btn btn-primary">Logout</button>
            </div>
        </div>
    </nav>
</template>