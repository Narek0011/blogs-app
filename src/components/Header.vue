<template>
  <header class="bg-gray-100 dark:bg-gray-800 p-4">
    <nav class="flex items-center justify-between">
      <!-- Navigation Links -->
      <ul class="flex space-x-4">
        <li v-for="route in authRoutes" :key="route.name">
          <router-link
              :to="route.path"
              class="text-gray-900 dark:text-white hover:underline"
          >
            {{ route.meta.title }}
          </router-link>
        </li>
      </ul>
      <!-- Logout Button -->
      <div class="flex content-center justify-between gap-2">
        <div v-if="user">
          <span class="text-white">{{ user.name }}</span> <br>
          <span :class="{'text-green-500': user.email_verified_at, 'text-red-500': !user.email_verified_at}">
            {{ user.email_verified_at ? 'Verified' : 'Not Verified' }}
          </span>
        </div>
        <button
            @click="logout"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from "vuex";
import {toast} from "vue3-toastify";

export default {
  name: 'HeaderPage',
  setup() {
    const store = useStore();
    const user = computed(() => store.state.users.user);
    const router = useRouter();
    const authRoutes = ref([
      {
        path: '/',
        name: 'Home',
        meta: {
          title: 'Blogs'
        },
      },
      {
        path: '/blogs/create',
        name: 'BlogCreate',
        meta: {
          title: 'Create Blog'
        },
      }
    ]);

    const logout = () => {
      store.dispatch('users/logout').then(() => {
        router.push('/login');
      }).catch((error) => {
        toast.error('An error occurred: ' + error.message);
      });
    };

    return {
      user,
      authRoutes,
      logout,
    };
  },
};
</script>

<style lang="scss" scoped>
header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

nav ul li {
  margin: 0;
}
</style>
