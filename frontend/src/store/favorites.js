import { defineStore } from 'pinia';

const API_URL = 'http://localhost:5000/api';

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favorites: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchFavorites(token) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`${API_URL}/favorites/mine`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Error al obtener favoritos');
                this.favorites = data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        }
    }
});