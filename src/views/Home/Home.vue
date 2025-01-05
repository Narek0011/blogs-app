<template>
  <aside v-if="blogsData?.blogs && blogsData?.blogs?.length" aria-label="Blog articles"
         class="blogs py-8 p-0 lg:py-24 bg-gray-50 dark:bg-gray-800">
    <div class="px-4 mx-auto max-w-screen-xl">
      <h2 class="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Blogs</h2>
      <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="(blog, index) in blogsData.blogs" :key="index" class="max-w-xs">
          <router-link :to="'blogs/' + blog.id">
            <img
                :src="blog.image ? blog.image : 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-4.png'"
                class="mb-5 rounded-lg" :alt="blog.title">
            <span class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
            Index: {{ index }} <br>
            Author: {{ blog.creator.name }}
          </span>
            <h2 class="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
              <a :href="blog.link">{{ blog.title }}</a>
            </h2>
            <p class="mb-4 text-gray-500 dark:text-gray-400">{{ blog.content }}</p>
          </router-link>
        </article>
      </div>
      <div class="pagination">
        <TailwindPagination
            :data="blogsData"
            @pagination-change-page="fetchBlogs"
        />
      </div>
    </div>
  </aside>
  <div class="flex mt-10 w-100 content-center justify-center" v-else-if="!loading && !blogsData?.blogs?.length">
    <router-link
        to='/blogs/create'
        class="inline-flex items-center text-3xl font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400"
    >
      Add New Blog
    </router-link>
  </div>
</template>
<script>
import {onBeforeMount, ref} from 'vue';
import {useStore} from "vuex";

export default {
  name: 'BlogPage',
  setup() {
    const store = useStore();
    const blogsData = ref();
    const loading = ref(true);

    const fetchBlogs = (page = 1) => {
      store.dispatch('blogs/getBlogs', {page}).finally(() => {
        loading.value = false
      });
    };

    onBeforeMount(() => {
      fetchBlogs();
      blogsData.value = {
        blogs: store?.state.blogs?.blogs.blogs,
        links: store?.state.blogs?.blogs.links,
        meta: store?.state.blogs?.blogs.meta,
      }
    });

    store.watch(
        (state) => state?.blogs?.blogs,
        (newBlogs) => {
          blogsData.value = {
            blogs: newBlogs?.blogs,
            links: newBlogs?.links,
            meta: newBlogs?.meta
          };
        }
    );

    return {
      fetchBlogs,
      blogsData,
      loading,
    };
  },
};
</script>
<style lang="scss" scoped>
.blogs {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

article {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.75rem;
}

h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

p {
  flex-grow: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: 1rem;
  color: #4b5563;
}

article:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Ensure equal size */
}

.pagination {
  margin-top: 100px;
}
</style>
