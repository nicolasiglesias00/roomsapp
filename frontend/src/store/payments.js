import { defineStore } from 'pinia';

const API_URL = 'http://localhost:5000/api';

export const usePaymentsStore = defineStore('payments', {
    state: () => ({
        payments: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchPayments(token) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`${API_URL}/payments/mine`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Error al obtener pagos');
                this.payments = data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        }
    }
});