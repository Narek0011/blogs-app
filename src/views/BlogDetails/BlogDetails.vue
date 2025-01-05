<template>
  <section class="bg-gray-50 dark:bg-gray-900 py-10">
    <div v-if="blog" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <div v-if="blog.image" class="flex-shrink-0 w-full lg:w-1/2 rounded-lg overflow-hidden shadow-lg">
          <img :src="blog.image" alt="Blog Image" class="w-full h-96 object-cover"/>
        </div>
        <div class="flex-1 overflow-hidden">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ blog.title }}</h1>
          <p class="text-lg text-gray-700 dark:text-gray-400 mb-6">{{ blog.content }}</p>
          <div v-if="isOwner" class="flex space-x-4 mt-6">
            <router-link
                :to="'/blogs/' + blog.id + '/edit'"
                class="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400"
            >
              Edit Blog
            </router-link>
            <button
                @click="deleteBlog(blog.id)"
                class="inline-flex items-center bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Delete Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {ref, onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useStore} from "vuex";

export default {
  name: 'BlogShowPage',
  setup() {
    const blog = ref(null);
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const fetchBlog = async (blogId) => {
      await store.dispatch('blogs/getBlogById', blogId);
      blog.value = store.getters['blogs/getCurrentBlog'];
    };

    const deleteBlog = async (blogId) => {
      if (confirm('Are you sure you want to delete this blog?')) {
        store.dispatch("blogs/deleteBlog", blogId).then(() => {
          router.push('/');
        })
      }
    };

    onMounted(() => {
      const blogId = route.params.id;
      fetchBlog(blogId);
    });

    const isOwner = computed(() => {
      const currentUser = store.getters['users/getUser'];
      return blog.value && blog.value.creator.id === currentUser.id;
    });

    return {
      blog,
      isOwner,
      deleteBlog,
    };
  },
};
</script>

<style lang="scss" scoped>
.blog-content {
  display: flex;
}

.blog-image {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.blog-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blog-actions {
  display: flex;
  gap: 12px;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #c53030;
}
</style>
