import {createApp} from 'vue'
import Vue3Toastify from 'vue3-toastify';
import App from './App.vue'
import router from './router';
import store from './store';
import './assets/tailwind.css';
import 'vue3-toastify/dist/index.css';
import {TailwindPagination} from "laravel-vue-pagination";

createApp(App)
    .use(router)
    .use(store)
    .use(Vue3Toastify, {
        autoClose: 3000,
    }).component('TailwindPagination', TailwindPagination)
    .mount('#app')
