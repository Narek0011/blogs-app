<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <form @submit.prevent="onSubmit" class="space-y-4 md:space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
              <input
                  id="name"
                  type="text"
                  v-model="name"
                  v-bind="nameAttrs"
                  :class="{'border-red-500': errors.name}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Joe"
              />
              <div v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input
                  type="email"
                  v-model="email"
                  v-bind="emailAttrs"
                  :class="{'border-red-500': errors.email}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
              />
              <div v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</div>
            </div>

            <!-- Password -->
            <div>
              <label for="password"
                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                  type="password"
                  v-model="password"
                  v-bind="passwordAttrs"
                  :class="{'border-red-500': errors.password}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
              />
              <div v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
                password</label>
              <input
                  type="password"
                  v-model="password_confirmation"
                  v-bind="confirmPasswordAttrs"
                  :class="{'border-red-500': errors.password_confirmation}"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
              />
              <div v-if="errors.password_confirmation" class="text-sm text-red-500 mt-1">{{ errors.password_confirmation }}</div>
            </div>

            <!-- Submit -->
            <button
                type="submit"
                :disabled="loading"
                :class="{
                  'bg-primary-600 hover:bg-primary-700': !loading,
                  'bg-gray-400 cursor-not-allowed': loading,
                }"
                class="w-full border-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <span v-if="!loading">Create an account</span>
              <span v-else>Loading...</span>
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <router-link to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login
                here
              </router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {useForm} from "vee-validate";
import * as yup from "yup";
import { useStore } from 'vuex';
import {useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import {ref} from "vue";

export default {
  name: "RegisterPage",
  setup() {
    const store = useStore();
    const router = useRouter();
    const {errors, handleSubmit, defineField} = useForm({
      validationSchema: yup.object({
        name: yup.string().required("Name is required").min(3),
        email: yup.string().email("Please enter a valid email").required("Email is required"),
        password: yup
            .string()
            .min(6, "Password must be at least 6 characters long")
            .required("Password is required"),
        password_confirmation: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Please confirm your password"),
      }),
    });

    const loading = ref(false);

    const onSubmit = handleSubmit((values) => {
      loading.value = true;
      store.dispatch('users/signup', values).then(() => {
        router.push('/');
      }).catch((error) => {
        toast.error('An error occurred: ' + error.message);
      }).finally(() => {
        loading.value = false;
      });
    });

    const [name, nameAttrs] = defineField("name");
    const [email, emailAttrs] = defineField("email");
    const [password, passwordAttrs] = defineField("password");
    const [password_confirmation, confirmPasswordAttrs] = defineField("password_confirmation");

    return {
      loading,
      name,
      nameAttrs,
      email,
      password,
      password_confirmation,
      emailAttrs,
      passwordAttrs,
      confirmPasswordAttrs,
      errors,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
