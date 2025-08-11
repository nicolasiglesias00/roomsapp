import { defineStore } from 'pinia';
import axios from '@/api/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role
    },

    actions: {
        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                console.log('Intentando login con:', { email });
                const response = await axios.post('/auth/login', { email, password });
                console.log('Respuesta del login:', response.data);

                const { token, user } = response.data;
                console.log('Token recibido:', token ? 'SÍ' : 'NO');
                console.log('User recibido:', user);

                this.token = token;
                this.user = user;
                localStorage.setItem('token', token);
                console.log('Token guardado en localStorage:', localStorage.getItem('token'));
                return true;
            } catch (error) {
                console.error('Error en login:', error);
                this.error = error.response?.data?.message || error.message;
                return false;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                console.log('Intentando registro con:', userData);
                const response = await axios.post('/auth/register', userData);
                console.log('Respuesta del registro:', response.data);

                const { token, user } = response.data;
                console.log('Token recibido:', token ? 'SÍ' : 'NO');
                console.log('User recibido:', user);

                this.token = token;
                this.user = user;
                localStorage.setItem('token', token);
                console.log('Token guardado en localStorage:', localStorage.getItem('token'));
                return true;
            } catch (error) {
                console.error('Error en registro:', error);
                this.error = error.response?.data?.message || error.message;
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchProfile() {
            if (!this.token) return;

            this.loading = true;
            try {
                const response = await axios.get('/auth/profile');
                this.user = response.data;
            } catch (error) {
                console.error('Error al obtener el perfil:', error);
                this.logout();
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        }
    }
}); 