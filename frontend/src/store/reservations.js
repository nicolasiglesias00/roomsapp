import { defineStore } from 'pinia';

const API_URL = 'http://localhost:5000/api';

export const useReservationsStore = defineStore('reservations', {
    state: () => ({
        reservations: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchMyReservations(token) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`${API_URL}/reservations/mine`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Error al obtener reservas');
                this.reservations = data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        }
    }
});