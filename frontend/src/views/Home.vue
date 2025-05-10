<template>
    <v-container>
        <v-row>
            <!-- Filtros -->
            <v-col cols="12" md="3">
                <v-card class="filters-card">
                    <v-card-title>Filtros</v-card-title>
                    <v-card-text>
                        <v-text-field v-model.number="filters.minPrice" label="Precio mínimo" type="number" prefix="€"
                            @update:model-value="updateFilters"></v-text-field>

                        <v-text-field v-model.number="filters.maxPrice" label="Precio máximo" type="number" prefix="€"
                            @update:model-value="updateFilters"></v-text-field>

                        <v-select v-model="filters.university" label="Universidad cercana" :items="universities"
                            clearable @update:model-value="updateFilters"></v-select>

                        <v-select v-model="filters.utilities" label="Servicios" :items="availableUtilities" multiple
                            chips clearable @update:model-value="updateFilters"></v-select>

                        <v-btn block color="error" variant="outlined" class="mt-4" @click="resetFilters">
                            Limpiar filtros
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Lista de habitaciones -->
            <v-col cols="12" md="9">
                <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>

                <div v-else-if="error" class="text-center pa-4">
                    <v-alert type="error" :text="error"></v-alert>
                </div>

                <template v-else>
                    <v-row>
                        <v-col v-for="room in filteredRooms" :key="room.id" cols="12" sm="6" lg="4">
                            <RoomCard :room="room" />
                        </v-col>
                    </v-row>

                    <div v-if="filteredRooms.length === 0" class="text-center pa-4">
                        <v-alert type="info"
                            text="No se encontraron habitaciones con los filtros seleccionados"></v-alert>
                    </div>
                </template>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRoomsStore } from '../store/rooms';
    import RoomCard from '../components/RoomCard.vue';

    const store = useRoomsStore();

    const filters = ref({
        minPrice: null,
        maxPrice: null,
        university: null,
        utilities: []
    });

    const universities = computed(() => {
        const unique = new Set(store.rooms.map(room => room.nearby_university));
        return Array.from(unique).filter(Boolean);
    });

    const availableUtilities = computed(() => {
        const unique = new Set(store.rooms.flatMap(room => room.utilities));
        return Array.from(unique).filter(Boolean);
    });

    const filteredRooms = computed(() => store.filteredRooms);
    const loading = computed(() => store.loading);
    const error = computed(() => store.error);

    const updateFilters = () => {
        store.setFilters(filters.value);
    };

    const resetFilters = () => {
        filters.value = {
            minPrice: null,
            maxPrice: null,
            university: null,
            utilities: []
        };
        store.resetFilters();
    };

    onMounted(async () => {
        await store.fetchRooms();
    });
</script>

<style scoped>
    .filters-card {
        position: sticky;
        top: 24px;
    }
</style>