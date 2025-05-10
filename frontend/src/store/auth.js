import { defineStore } from 'pinia';

const API_URL = 'http://localhost:5000/api';

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
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al iniciar sesión');
                }

                const { token, user } = data;
                this.token = token;
                this.user = user;
                localStorage.setItem('token', token);
                return true;
            } catch (error) {
                this.error = error.message;
                return false;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al registrar usuario');
                }

                const { token, user } = data;
                this.token = token;
                this.user = user;
                localStorage.setItem('token', token);
                return true;
            } catch (error) {
                this.error = error.message;
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchProfile() {
            if (!this.token) return;

            this.loading = true;
            try {
                const response = await fetch(`${API_URL}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al obtener el perfil');
                }

                this.user = data;
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