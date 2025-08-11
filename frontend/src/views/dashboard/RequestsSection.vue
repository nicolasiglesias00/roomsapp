<template>
    <div class="requests-section">
        <v-card>
            <v-card-title>
                Solicitudes de Reserva
            </v-card-title>

            <v-card-text>
                <v-row v-if="loading">
                    <v-col cols="12" class="text-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                </v-row>

                <v-row v-else-if="requests.length === 0">
                    <v-col cols="12" class="text-center">
                        <v-icon size="64" color="grey">mdi-email</v-icon>
                        <p class="text-h6 mt-4">No hay solicitudes de reserva</p>
                        <p class="text-body-2 text-grey">Las solicitudes aparecerán aquí cuando los estudiantes
                            soliciten tus habitaciones</p>
                    </v-col>
                </v-row>

                <v-row v-else>
                    <v-col v-for="request in requests" :key="request.id" cols="12">
                        <v-card outlined>
                            <v-card-title class="d-flex justify-space-between align-center">
                                <span>Solicitud #{{ request.id }}</span>
                                <v-chip :color="getStatusColor(request.status)" small>
                                    {{ getStatusText(request.status) }}
                                </v-chip>
                            </v-card-title>

                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <h4>Habitación</h4>
                                        <p><strong>{{ request.room.title }}</strong></p>
                                        <p class="text-grey">{{ request.room.address }}</p>
                                        <p class="text-h6">€{{ request.room.price }}/mes</p>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <h4>Solicitante</h4>
                                        <p><strong>{{ request.student.name }} {{ request.student.surname }}</strong></p>
                                        <p class="text-grey">{{ request.student.email }}</p>
                                        <p class="text-grey">{{ request.student.phone }}</p>
                                    </v-col>
                                </v-row>

                                <v-divider class="my-4"></v-divider>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <h4>Fechas de Reserva</h4>
                                        <p><strong>Inicio:</strong> {{ formatDate(request.startDate) }}</p>
                                        <p><strong>Fin:</strong> {{ formatDate(request.endDate) }}</p>
                                        <p><strong>Duración:</strong> {{ calculateDuration(request.startDate,
                                            request.endDate) }} meses</p>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <h4>Mensaje del Solicitante</h4>
                                        <p class="text-grey">{{ request.message || 'Sin mensaje adicional' }}</p>
                                    </v-col>
                                </v-row>

                                <v-divider class="my-4"></v-divider>

                                <v-row>
                                    <v-col cols="12">
                                        <h4>Total Estimado</h4>
                                        <p class="text-h5 font-weight-bold">€{{ calculateTotal(request.room.price,
                                            request.startDate, request.endDate) }}</p>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <v-card-actions v-if="request.status === 'pending'">
                                <v-btn color="success" @click="approveRequest(request.id)" :loading="processing">
                                    <v-icon left>mdi-check</v-icon>
                                    Aprobar
                                </v-btn>
                                <v-btn color="error" @click="rejectRequest(request.id)" :loading="processing">
                                    <v-icon left>mdi-close</v-icon>
                                    Rechazar
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="viewRoomDetails(request.room.id)">
                                    Ver Habitación
                                </v-btn>
                            </v-card-actions>

                            <v-card-actions v-else>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="viewRoomDetails(request.room.id)">
                                    Ver Habitación
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from '@/api/axios';

    const router = useRouter();

    // Estado reactivo
    const loading = ref(false);
    const processing = ref(false);
    const requests = ref([]);

    // Métodos
    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            approved: 'success',
            rejected: 'error',
            cancelled: 'grey'
        };
        return colors[status] || 'grey';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pendiente',
            approved: 'Aprobada',
            rejected: 'Rechazada',
            cancelled: 'Cancelada'
        };
        return texts[status] || 'Desconocido';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        return diffMonths;
    };

    const calculateTotal = (price, startDate, endDate) => {
        const months = calculateDuration(startDate, endDate);
        return (price * months).toFixed(2);
    };

    const loadRequests = async () => {
        loading.value = true;
        try {
            const response = await axios.get('/reservations/landlord-requests');
            requests.value = response.data;
        } catch (error) {
            console.error('Error cargando solicitudes:', error);
        } finally {
            loading.value = false;
        }
    };

    const approveRequest = async (requestId) => {
        processing.value = true;
        try {
            await axios.put(`/reservations/${requestId}/approve`);
            await loadRequests();
        } catch (error) {
            console.error('Error aprobando solicitud:', error);
        } finally {
            processing.value = false;
        }
    };

    const rejectRequest = async (requestId) => {
        processing.value = true;
        try {
            await axios.put(`/reservations/${requestId}/reject`);
            await loadRequests();
        } catch (error) {
            console.error('Error rechazando solicitud:', error);
        } finally {
            processing.value = false;
        }
    };

    const viewRoomDetails = (roomId) => {
        router.push(`/room/${roomId}`);
    };

    // Cargar solicitudes al montar el componente
    onMounted(() => {
        loadRequests();
    });
</script>

<style scoped>
    .requests-section {
        padding: 20px;
    }
</style>