<template>

    <h2 class="text-h5 font-weight-bold mb-4">Mis reservas</h2>

    <h3 class="text-h6 mb-2">Próximas reservas</h3>
    <v-alert v-if="upcoming.length === 0" type="info" border="start" class="mb-4">
        No tienes reservas próximas.
    </v-alert>
    <v-row>
        <v-col v-for="res in upcoming" :key="res.id" cols="12">
            <v-card class="mx-auto w-100" elevation="2">
                <v-img :src="res.room.image" height="180px" cover />
                <v-card-title>{{ res.room.title }}</v-card-title>
                <v-card-subtitle>
                    {{ formatDate(res.start_date) }} - {{ formatDate(res.end_date) }}
                </v-card-subtitle>
                <v-card-text>
                    <div>
                        <strong>Precio:</strong> {{ res.room.monthly_price }} €/mes
                    </div>
                    <div>
                        <strong>Estado:</strong>
                        <v-chip :color="res.status === 'confirmed' ? 'success' : 'warning'" size="small">
                            {{ res.status === 'confirmed' ? 'Confirmada' : res.status }}
                        </v-chip>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" variant="outlined" @click="editReservation(res)">
                        <v-icon start>mdi-pencil</v-icon>
                        Editar
                    </v-btn>
                    <v-btn color="error" variant="outlined" @click="cancelReservation(res)">
                        <v-icon start>mdi-cancel</v-icon>
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>

    <h3 class="text-h6 mt-6 mb-2">Reservas pasadas</h3>
    <v-alert v-if="past.length === 0" type="info" border="start" class="mb-4">
        No tienes reservas pasadas.
    </v-alert>
    <v-row v-else>
        <v-col v-for="res in past" :key="res.id" cols="12">
            <v-card class="mx-auto w-100" elevation="2">
                <v-img :src="res.room.image" height="180px" cover />
                <v-card-title>{{ res.room.title }}</v-card-title>
                <v-card-subtitle>
                    {{ formatDate(res.start_date) }} - {{ formatDate(res.end_date) }}
                </v-card-subtitle>
                <v-card-text>
                    <div>
                        <strong>Precio:</strong> {{ res.room.monthly_price }} €/mes
                    </div>
                    <div>
                        <strong>Estado:</strong>
                        <v-chip color="grey" size="small">Finalizada</v-chip>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" variant="outlined" @click="viewReservation(res)">
                        <v-icon start>mdi-eye</v-icon>
                        Ver detalles
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>

</template>

<script setup>
    import { computed, onMounted } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { useReservationsStore } from '@/store/reservations';

    const authStore = useAuthStore();
    const reservationsStore = useReservationsStore();

    onMounted(() => {
        if (authStore.token) {
            reservationsStore.fetchMyReservations(authStore.token);
        }
    });

    const today = new Date();

    const upcoming = computed(() =>
        reservationsStore.reservations.filter(r => new Date(r.end_date) >= today)
    );
    const past = computed(() =>
        reservationsStore.reservations.filter(r => new Date(r.end_date) < today)
    );

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    }

    function editReservation(reservation) {
        // Aquí irá la lógica de edición
        alert('Editar reserva: ' + reservation.id);
    }

    function cancelReservation(reservation) {
        // Aquí irá la lógica de cancelación
        alert('Cancelar reserva: ' + reservation.id);
    }

    function viewReservation(reservation) {
        // Aquí irá la lógica de ver detalles
        alert('Ver detalles de la reserva: ' + reservation.id);
    }
</script>