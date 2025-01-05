<template>
  <main>
     <Header v-if="isAuthenticated.id" />
     <RouterView/>
  </main>
</template>
<script>
import Header from "@/components/Header.vue";
import {useStore} from "vuex";
import {computed, onMounted} from "vue";
export default {
  name: 'App',
  components: {Header},
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.state.users.user);
    onMounted(() => {
      store.dispatch('users/getAuthUser');
      store.dispatch('blogs/getBlogs', {page: 1})
    });
    return { isAuthenticated: isAuthenticated };
  }
}
</script>
<style>
  html {
    background: rgb(31 41 55);
  }
</style>
