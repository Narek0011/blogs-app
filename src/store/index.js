import { createStore } from 'vuex';
import usersModule from './modules/users';
import blogsModule from "@/store/modules/blogs";

const store = createStore({
    modules: {
        users: usersModule,
        blogs: blogsModule,
    },
});

export default store;
