import { defineStore } from 'pinia';

const API_URL = 'http://localhost:5000/api';

export const useContractsStore = defineStore('contracts', {
    state: () => ({
        contracts: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchContracts(token) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`${API_URL}/contracts/mine`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Error al obtener contratos');
                this.contracts = data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        }
    }
});