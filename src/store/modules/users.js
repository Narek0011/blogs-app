import apiClient from '@/services/apiService';

const usersModule = {
    namespaced: true,
    state: {
        user: {},
    },
    actions: {
        async signup({ commit },data) {
            await apiClient.post('/signup', data).then(res => {
                localStorage.setItem('token', res.data.token)
                commit('SET_USER', res.data.user);
                return res
            })
        },
        async login({ commit },data) {
            await apiClient.post('/login', data).then(res => {
                localStorage.setItem('token', res.data.token)
                commit('SET_USER', res.data.user);
                return res
            })
        },
        async getAuthUser({ commit }) {
            await apiClient.get('/getAuthUser').then(res => {
                commit('SET_USER', res.data.user);
                return res
            }).catch(err => {
                console.error('err',err)
            })
        },
        async logout({ commit },data) {
            await apiClient.get('/logout', data).then(() => {
                localStorage.removeItem('token')
                commit('SET_USER', []);
            })
        },
    },
    mutations: {
        SET_USER(state, payload) {
            state.user = payload;
        },
    },
    getters: {
        getUser: (state) => state.user,
    },
};

export default usersModule;
