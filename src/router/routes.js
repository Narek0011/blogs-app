import {
    Home,
    NotFound,
    Register,
    Login,
    BlogCreate,
    BlogEdit,
    BlogDetails,
} from '@/views';

export default [
    {
        path: '/',
        component: Home,
        name: 'Home',
        meta: {
            title: 'Blogs',
            requiresAuth: true,
        },
    },
    {
        path: '/register',
        component: Register,
        name: 'Register',
        meta: {
            title: 'Register',
            requiresGuest: true,
        },
    },
    {
        path: '/login',
        component: Login,
        name: 'Login',
        meta: {
            title: 'Login',
            requiresGuest: true,
        },
    },
    {
        path: '/blogs/create',
        component: BlogCreate,
        name: 'BlogCreate',
        meta: {
            title: 'Create Blog',
            requiresAuth: true,
        },
    },
    {
        path: '/blogs/:id/edit',
        component: BlogEdit,
        name: 'BlogEdit',
        meta: {
            title: 'Edit Blog',
            requiresAuth: true,
        },
    },
    {
        path: '/blogs/:id',
        component: BlogDetails,
        name: 'BlogDetails',
        meta: {
            title: 'Blog Details',
            requiresAuth: true,
        },
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound,
        name: 'Error 404',
        meta: {
            title: 'Page not Found',
        },
    },
];
