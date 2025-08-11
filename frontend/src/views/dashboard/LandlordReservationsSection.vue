<template>
    <div class="landlord-reservations-section">
        <h2 class="text-h5 font-weight-bold mb-4">Reservas de mis habitaciones</h2>

        <v-tabs v-model="activeTab" class="mb-4">
            <v-tab value="active">Reservas Activas</v-tab>
            <v-tab value="upcoming">Próximas</v-tab>
            <v-tab value="past">Pasadas</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
            <!-- Reservas Activas -->
            <v-window-item value="active">
                <v-alert v-if="activeReservations.length === 0" type="info" border="start" class="mb-4">
                    No tienes reservas activas en este momento.
                </v-alert>
                <v-row v-else>
                    <v-col v-for="reservation in activeReservations" :key="reservation.id" cols="12" md="6">
                        <v-card elevation="2">
                            <v-img :src="reservation.room.images?.[0] || '/placeholder-room.jpg'" height="180px"
                                cover />
                            <v-card-title>{{ reservation.room.title }}</v-card-title>
                            <v-card-subtitle>
                                <v-icon small>mdi-account</v-icon>
                                {{ reservation.student.name }} {{ reservation.student.surname }}
                            </v-card-subtitle>
                            <v-card-text>
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span><strong>Período:</strong></span>
                                    <span>{{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate)
                                        }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span><strong>Precio:</strong></span>
                                    <span class="text-h6">€{{ reservation.room.price }}/mes</span>
                                </div>
                                <div class="d-flex justify-space-between align-center">
                                    <span><strong>Estado:</strong></span>
                                    <v-chip :color="getStatusColor(reservation.status)" size="small">
                                        {{ getStatusText(reservation.status) }}
                                    </v-chip>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn text color="primary" @click="viewReservationDetails(reservation)">
                                    Ver detalles
                                </v-btn>
                                <v-btn text color="info" @click="viewRoomDetails(reservation.room.id)">
                                    Ver habitación
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>

            <!-- Próximas Reservas -->
            <v-window-item value="upcoming">
                <v-alert v-if="upcomingReservations.length === 0" type="info" border="start" class="mb-4">
                    No tienes reservas próximas.
                </v-alert>
                <v-row v-else>
                    <v-col v-for="reservation in upcomingReservations" :key="reservation.id" cols="12" md="6">
                        <v-card elevation="2">
                            <v-img :src="reservation.room.images?.[0] || '/placeholder-room.jpg'" height="180px"
                                cover />
                            <v-card-title>{{ reservation.room.title }}</v-card-title>
                            <v-card-subtitle>
                                <v-icon small>mdi-account</v-icon>
                                {{ reservation.student.name }} {{ reservation.student.surname }}
                            </v-card-subtitle>
                            <v-card-text>
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span><strong>Inicio:</strong></span>
                                    <span>{{ formatDate(reservation.startDate) }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span><strong>Fin:</strong></span>
                                    <span>{{ formatDate(reservation.endDate) }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center">
                                    <span><strong>Precio:</strong></span>
                                    <span class="text-h6">€{{ reservation.room.price }}/mes</span>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn text color="primary" @click="viewReservationDetails(reservation)">
                                    Ver detalles
                                </v-btn>
                                <v-btn text color="info" @click="viewRoomDetails(reservation.room.id)">
                                    Ver habitación
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>

            <!-- Reservas Pasadas -->
            <v-window-item value="past">
                <v-alert v-if="pastReservations.length === 0" type="info" border="start" class="mb-4">
                    No tienes reservas pasadas.
                </v-alert>
                <v-row v-else>
                    <v-col v-for="reservation in pastReservations" :key="reservation.id" cols="12" md="6">
                        <v-card elevation="2">
                            <v-img :src="reservation.room.images?.[0] || '/placeholder-room.jpg'" height="180px"
                                cover />
                            <v-card-title>{{ reservation.room.title }}</v-card-title>
                            <v-card-subtitle>
                                <v-icon small>mdi-account</v-icon>
                                {{ reservation.student.name }} {{ reservation.student.surname }}
                            </v-card-subtitle>
                            <v-card-text>
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span><strong>Período:</strong></span>
                                    <span>{{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate)
                                        }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center">
                                    <span><strong>Precio:</strong></span>
                                    <span class="text-h6">€{{ reservation.room.price }}/mes</span>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn text color="primary" @click="viewReservationDetails(reservation)">
                                    Ver detalles
                                </v-btn>
                                <v-btn text color="info" @click="viewRoomDetails(reservation.room.id)">
                                    Ver habitación
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>

        <v-progress-linear v-if="loading" indeterminate color="primary" class="mt-4" />
        <v-alert v-if="error" type="error" class="mt-4">
            {{ error }}
        </v-alert>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from '@/api/axios';

    const router = useRouter();

    // Estado reactivo
    const loading = ref(false);
    const error = ref(null);
    const reservations = ref([]);
    const activeTab = ref('active');

    // Métodos
    const getStatusColor = (status) => {
        const colors = {
            active: 'success',
            confirmed: 'success',
            pending: 'warning',
            cancelled: 'error',
            completed: 'grey'
        };
        return colors[status] || 'grey';
    };

    const getStatusText = (status) => {
        const texts = {
            active: 'Activa',
            confirmed: 'Confirmada',
            pending: 'Pendiente',
            cancelled: 'Cancelada',
            completed: 'Completada'
        };
        return texts[status] || 'Desconocido';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const loadReservations = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get('/reservations/landlord');
            reservations.value = response.data;
        } catch (err) {
            error.value = 'Error cargando las reservas';
            console.error('Error cargando reservas:', err);
        } finally {
            loading.value = false;
        }
    };

    const viewReservationDetails = (reservation) => {
        // Aquí podrías abrir un modal o navegar a una página de detalles
        console.log('Ver detalles de reserva:', reservation.id);
    };

    const viewRoomDetails = (roomId) => {
        router.push(`/room/${roomId}`);
    };

    // Computed properties
    const today = new Date();

    const activeReservations = computed(() => {
        return reservations.value.filter(r => {
            const startDate = new Date(r.startDate);
            const endDate = new Date(r.endDate);
            return startDate <= today && endDate >= today && r.status === 'active';
        });
    });

    const upcomingReservations = computed(() => {
        return reservations.value.filter(r => {
            const startDate = new Date(r.startDate);
            return startDate > today && r.status === 'confirmed';
        });
    });

    const pastReservations = computed(() => {
        return reservations.value.filter(r => {
            const endDate = new Date(r.endDate);
            return endDate < today;
        });
    });

    // Cargar reservas al montar el componente
    onMounted(() => {
        loadReservations();
    });
</script>

<style scoped>
    .landlord-reservations-section {
        padding: 20px;
    }
</style>