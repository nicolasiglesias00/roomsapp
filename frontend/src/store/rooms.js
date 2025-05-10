import { defineStore } from 'pinia';

export const useRoomsStore = defineStore('rooms', {
    state: () => ({
        rooms: [],
        currentRoom: null,
        loading: false,
        error: null,
        filters: {
            minPrice: null,
            maxPrice: null,
            university: null,
            utilities: []
        }
    }),

    getters: {
        filteredRooms: (state) => {
            return state.rooms.filter(room => {
                if (state.filters.minPrice && room.monthly_price < state.filters.minPrice) return false;
                if (state.filters.maxPrice && room.monthly_price > state.filters.maxPrice) return false;
                if (state.filters.university && room.nearby_university !== state.filters.university) return false;
                if (state.filters.utilities.length > 0) {
                    return state.filters.utilities.every(utility => room.utilities.includes(utility));
                }
                return true;
            });
        }
    },

    actions: {
        async fetchRooms() {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch('http://localhost:5000/api/rooms');
                if (!response.ok) throw new Error('Error al cargar las habitaciones');
                this.rooms = await response.json();
            } catch (error) {
                this.error = error.message || 'Error al cargar las habitaciones';
                console.error('Error fetching rooms:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchRoomById(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
                if (!response.ok) throw new Error('Error al cargar los detalles de la habitación');
                this.currentRoom = await response.json();
            } catch (error) {
                this.error = error.message || 'Error al cargar los detalles de la habitación';
                console.error('Error fetching room details:', error);
            } finally {
                this.loading = false;
            }
        },

        setFilters(filters) {
            this.filters = filters;
        },

        resetFilters() {
            this.filters = {
                minPrice: null,
                maxPrice: null,
                university: null,
                utilities: []
            };
        }
    }
}); 