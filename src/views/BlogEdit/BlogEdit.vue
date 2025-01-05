<template>
  <section class="bg-gray-50 dark:bg-gray-900 pt-6 pb-6">
    <div class="flex flex-col items-center justify-center lg:py-0">
      <div
          class="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-8 space-y-6">
          <h1 class="text-2xl font-semibold leading-tight text-gray-900 dark:text-white">
            Edit Blog
          </h1>
          <form @submit.prevent="onSubmit" class="space-y-6">
            <div>
              <label for="image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog Image</label>
              <input
                  type="file"
                  name="image"
                  id="image"
                  @change="handleImageChange"
                  v-bind="imageAttrs"
                  :class="{'border-red-500': errors.image}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <div v-if="errors.image" class="text-sm text-red-500">{{ errors.image }}</div>
              <div v-if="currentImage" class="mt-2">
                <img :src="currentImage" alt="Current Blog Image" class="w-32 h-32 object-cover rounded-lg"/>
              </div>
            </div>
            <div>
              <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog Title</label>
              <input
                  type="text"
                  name="title"
                  id="title"
                  v-model="title"
                  v-bind="titleAttrs"
                  :class="{'border-red-500': errors.title}"
                  placeholder="Enter the blog title"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
              />
              <div v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</div>
            </div>
            <div>
              <label for="content" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog
                Content</label>
              <textarea
                  name="content"
                  id="content"
                  v-model="content"
                  v-bind="contentAttrs"
                  :class="{'border-red-500': errors.content}"
                  rows="6"
                  placeholder="Write your blog content here..."
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
              ></textarea>
              <div v-if="errors.content" class="text-sm text-red-500">{{ errors.content }}</div>
            </div>
            <button
                type="submit"
                :disabled="loading"
                :class="{
                  'bg-primary-600 hover:bg-primary-700': !loading,
                  'bg-gray-400 cursor-not-allowed': loading,
                }"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <span v-if="!loading">Update Blog</span>
              <span v-else>Loading...</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {useForm} from 'vee-validate';
import * as yup from 'yup';
import {ref, onMounted, computed} from 'vue';
import {useStore} from 'vuex';
import {toast} from 'vue3-toastify';
import {useRouter, useRoute} from 'vue-router';

export default {
  name: 'BlogEditPage',
  setup() {
    const loading = ref(false);
    const blog = ref(null);
    const currentImage = ref(null);
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const blogId = route.params.id;

    const {errors, handleSubmit, defineField, setFieldValue} = useForm({
      validationSchema: yup.object({
        image: yup.mixed().notRequired(),
        title: yup.string().min(5, 'Title must be at least 5 characters long').required('Title is required'),
        content: yup.string().min(10, 'Content must be at least 10 characters long').required('Content is required'),
      }),
    });

    const [image, imageAttrs] = defineField('image');
    const [title, titleAttrs] = defineField('title');
    const [content, contentAttrs] = defineField('content');

    const isOwner = computed(() => {
      const currentUser = store.getters['users/getUser'];
      return blog.value && blog.value.creator.id === currentUser.id;
    });

    const fetchBlog = async () => {
      try {
        await store.dispatch('blogs/getBlogById', blogId);
        blog.value = store.getters['blogs/getCurrentBlog'];
        currentImage.value = blog.value.image;
        setFieldValue('title', blog.value.title);
        setFieldValue('content', blog.value.content);
      } catch (error) {
        toast.error('Failed to fetch blog data');
      }
    };

    onMounted(async () => {
      await fetchBlog();
      if (!isOwner.value) {
        router.push(`/blogs/${blogId}`);
      }
    });

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (validImageTypes.includes(file.type)) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            currentImage.value = fileReader.result;
          };
          fileReader.readAsDataURL(file);
          setFieldValue('image', file);
        } else {
          toast.error('Invalid file type. Please select an image file.');
        }
      }
    };

    const onSubmit = handleSubmit((values) => {
      loading.value = true;
      const formData = new FormData();
      if (values.image) formData.append('image', values.image);
      formData.append('title', values.title);
      formData.append('content', values.content);

      store.dispatch('blogs/updateBlog', {blogId, blogData: formData}).then(() => {
        router.push(`/blogs/${blogId}`);
      }).catch(err => {
        toast.error(err?.message)
      }).finally(() => {
        loading.value = false;
      });
    });

    return {
      handleImageChange,
      imageAttrs,
      titleAttrs,
      contentAttrs,
      loading,
      currentImage,
      title,
      content,
      image,
      errors,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
