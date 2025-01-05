<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form @submit.prevent="onSubmit" class="space-y-4 md:space-y-6">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input
                  type="email"
                  v-model="email"
                  v-bind="emailAttrs"
                  :class="{'border-red-500': errors.email}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
              />
              <div v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</div>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                  type="password"
                  v-model="password"
                  v-bind="passwordAttrs"
                  :class="{'border-red-500': errors.password}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
              />
              <div v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</div>
            </div>
            <button
                type="submit"
                :disabled="loading"
                :class="{
                  'bg-primary-600 hover:bg-primary-700': !loading,
                  'bg-gray-400 cursor-not-allowed': loading,
                }"
                class="w-full border-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <span v-if="!loading">Sign in</span>
              <span v-else>Loading...</span>
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet? <router-link to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import {ref} from "vue";
export default {
  name: 'LoginPage',
  setup() {
    const loading = ref(false);
    const store = useStore();
    const router = useRouter();
    const { errors, handleSubmit, defineField } = useForm({
      validationSchema: yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
      }),
    });

    const onSubmit = handleSubmit(values => {
      loading.value = true;
      store.dispatch('users/login', values).then(() => {
        router.push('/');
      }).catch((error) => {
        toast.error('An error occurred: ' + error.message);
      }).finally(() => {
        loading.value = false;
      });
    })

    const [email, emailAttrs] = defineField('email');
    const [password, passwordAttrs] = defineField('password');

    return {
      loading,
      email,
      password,
      emailAttrs,
      passwordAttrs,
      errors,
      onSubmit,
    };
  },
};
</script>
