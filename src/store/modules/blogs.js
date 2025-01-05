import apiClient from '@/services/apiService';

const blogsModule = {
    namespaced: true,
    state: {
        blogs: [],
        currentBlog: null,
    },
    actions: {
        async getBlogs({commit}, {page}) {
            try {
                await apiClient.get('/blogs', {
                    params: {page}
                }).then(response => {
                    commit('GET_BLOGS', response.data);
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        async createBlog({commit}, blogData) {
            try {
                await apiClient.post('/blogs/create', blogData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    commit('ADD_BLOG', res.data.blog);
                    return res;
                }).catch(err => {
                    return err;
                });
            } catch (error) {
                console.error('Error creating blog:', error);
            }
        },
        async getBlogById({commit}, blogId) {
            try {
                await apiClient.get(`/blogs/show/${blogId}`).then(res => {
                    commit('SET_CURRENT_BLOG', res.data.blog);
                });
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        },
        async updateBlog({commit}, {blogId, blogData}) {
            await apiClient.post(`/blogs/update/${blogId}`, blogData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                commit('UPDATE_BLOG', res.data.blog);
                return res
            }).catch(err => {
                throw err;
            });
        },
        async deleteBlog({commit}, blogId) {
            try {
                await apiClient.delete(`/blogs/delete/${blogId}`).then(() => {
                    commit('REMOVE_BLOG', blogId);
                });
            } catch (error) {
                console.error('Error deleting blog:', error);
            }
        },
    },
    mutations: {
        GET_BLOGS(state, payload) {
            state.blogs = payload;
        },
        ADD_BLOG(state, newBlog) {
            if (state.blogs.blogs.length === 4) {
                state.blogs.blogs.shift();
            }
            state.blogs.blogs.unshift(newBlog);
        },
        SET_CURRENT_BLOG(state, blog) {
            state.currentBlog = blog;
        },
        REMOVE_BLOG(state, blogId) {
            console.log('blogId', blogId)
            state.blogs.blogs = state.blogs.blogs.filter(blog => blog.id !== blogId);
            if (state.currentBlog && state.currentBlog.id === blogId) {
                state.currentBlog = null;
            }
        },
    },
    getters: {
        getBlogs: (state) => state.blogs,
        getCurrentBlog: (state) => state.currentBlog,
    },
};

export default blogsModule;
