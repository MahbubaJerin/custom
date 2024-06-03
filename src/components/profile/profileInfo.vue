<script setup>
import { getAuth } from "firebase/auth";
import { useCollection, useCurrentUser } from "vuefire";
import { ref } from "vue";
import { db, userRef } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const auth = getAuth();
const uid = auth.currentUser.uid;
const email = ref("");
const username = ref("");
const gender = ref("");
const age = ref("");
const updating = ref(false);

const updateUserData = async () => {
  const docRef = doc(userRef, uid);
    await updateDoc(docRef, {
        username: username.value,
        age: age.value, 
        gender: gender.value
    });
    alert("User data updated successfully");
    updating.value = false;
};

const setGender = (value) => {
    gender.value = value;
};

const fetchUserData = async () => {
  const docRef = doc(userRef, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    email.value = docSnap.data().email;
    username.value = docSnap.data().username;
    age.value = docSnap.data().age;
    gender.value= docSnap.data().gender;
  }
};

fetchUserData();
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div v-if="email" class="card-body">
            <h1 class="text-center text-green">About You</h1>

            <form>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                    disabled
                />
              </div>
              <div class="mb-3">
                <label for="username" class="form-label">User name</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  :disabled="!updating"
                />
              </div>
              <div class="mb-3">
                <label for="age" class="form-label">Age</label>
                <input
                  type="number"
                  class="form-control"
                  id="age"
                  v-model="age"
                    :disabled="!updating"
                />
              </div>
              <div class="dropdown">
                <button v-if="!gender"
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  :disabled="!updating"
                >
                Select Gender
                </button>
                <button v-else
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  :disabled="!updating"
                > 
            {{ gender }}
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <button class="dropdown-item" @click.prevent= "setGender('Male')">Male</button>
                    </li>
                    <li>
                        <button class="dropdown-item" @click.prevent= "setGender('Female')">Female</button>
                    </li>
                </ul>
              </div>
            </form>
            <button
              v-if="!updating"
              class="btn btn-primary mt-3"
              @click="updating = true"
            >Update</button>
            <button
              v-else
              class="btn btn-primary mt-3"
              @click="updateUserData"
            >Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  background-color: #40A578; /* Forest Green */
  color: #FFFFFF; /* White */
}

.btn-primary {
  background-color: #13be13; /* Dark Green */
  border-color: #d60a0a; /* Dark Green */
}

.btn-secondary {
  background-color: #0f4507; /* Lime Green */
  border-color: #24ed27; /* Lime Green */
}

.dropdown-menu {
  background-color: #006400; /* Dark Green */
}

.dropdown-item {
  color: #FFFFFF; /* White */
}

.text-green {
  color: #006400; /* Dark Green */
}


.dropdown-item:hover {
  background-color: #145c14; /* Lime Green */
}
</style>