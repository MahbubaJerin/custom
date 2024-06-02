<script setup>
import { signOut, getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";

const auth = getAuth();
const router = useRouter();

// Initialize loading state and fetch the current user
const loading = true; // You can handle loading state based on getCurrentUser() promise
const user = useCurrentUser();
let uid;
if (user) {
    uid = auth.currentUser?.uid;
}

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
    <nav class="navbar navbar-expand-lg bg-pastel-green">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">PlantBook</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li v-if="user" class="nav-item">
                        <router-link class="nav-link" :to="{ path: '/' }">Home</router-link>
                    </li>
                    <li v-if="user" class="nav-item">
                        <router-link class="nav-link" :to="{ path: `/profile/${uid}` }">Profile</router-link>
                    </li>
                    <li v-if="user" class="nav-item">
                        <router-link class="nav-link" to="/account">Account</router-link>
                    </li>
                    <li v-if="!user" class="nav-item">
                        <router-link class="nav-link" to="/signup">Signup</router-link>
                    </li>
                    <li v-if="!user" class="nav-item">
                        <router-link class="nav-link" to="/login">Login</router-link>
                    </li>
                </ul>
                <button v-if="user" @click="handleLogout" class="btn btn-primary">Logout</button>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background-color:  #40A578;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle shadow for depth */
}

.navbar-brand {
    color: #40a578; /* Theme color for the brand */
    font-weight: bold; /* Make the brand text bold */
    font-size: 24px; /* Increase font size for emphasis */
}

.nav-link {
    color: #333; /* Dark gray color for links */
    font-weight: bold; /* Make links bold */
    transition: color 0.3s ease; /* Smooth color transition on hover */
}

.nav-link:hover {
    color: #40a578; /* Theme color on hover */
}

.btn-primary {
    background-color: #40a578; /* Theme color for the logout button */
    border-color: #40a578; /* Same color for button border */
    font-weight: bold; /* Make button text bold */
}

.btn-primary:hover {
    background-color: #1f6f52; /* Darker shade on hover */
    border-color: #1f6f52; /* Adjust border color on hover */
}
</style>
