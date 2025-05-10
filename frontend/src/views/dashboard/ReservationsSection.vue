<template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-4">Mis reservas</h2>

        <h3 class="text-h6 mb-2">Próximas reservas</h3>
        <v-alert v-if="upcoming.length === 0" type="info" border="start" class="mb-4">
            No tienes reservas próximas.
        </v-alert>
        <v-list v-else>
            <v-list-item v-for="res in upcoming" :key="res.id">
                <v-list-item-content>
                    <v-list-item-title>{{ res.roomTitle }}</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ formatDate(res.start) }} - {{ formatDate(res.end) }}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <!-- Puedes añadir botones de cancelar, ver detalles, etc. -->
            </v-list-item>
        </v-list>

        <h3 class="text-h6 mt-6 mb-2">Reservas pasadas</h3>
        <v-alert v-if="past.length === 0" type="info" border="start" class="mb-4">
            No tienes reservas pasadas.
        </v-alert>
        <v-list v-else>
            <v-list-item v-for="res in past" :key="res.id">
                <v-list-item-content>
                    <v-list-item-title>{{ res.roomTitle }}</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ formatDate(res.start) }} - {{ formatDate(res.end) }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    // import { useReservationsStore } from '@/store/reservations'; // si tienes un store

    const reservations = ref([
        // Ejemplo de datos
        { id: 1, roomTitle: 'Habitación Centro', start: '2024-06-10', end: '2024-06-20' },
        { id: 2, roomTitle: 'Habitación Playa', start: '2024-05-01', end: '2024-05-10' }
    ]);

    const today = new Date();

    const upcoming = computed(() =>
        reservations.value.filter(r => new Date(r.end) >= today)
    );
    const past = computed(() =>
        reservations.value.filter(r => new Date(r.end) < today)
    );

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    }

    // onMounted(() => { ...cargar reservas reales... });
</script>