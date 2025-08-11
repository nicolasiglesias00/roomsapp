<template>
    <div class="rooms-section">
        <v-card>
            <v-card-title>
                <v-row align="center" justify="space-between" class="w-100 ma-0 pa-0">
                    <v-col cols="auto" class="pa-0">
                        <span class="text-h6 font-weight-bold">Mis Habitaciones</span>
                    </v-col>
                </v-row>

            </v-card-title>

            <v-card-text>

                <v-row v-if="loading">
                    <v-col cols="12" class="text-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                </v-row>

                <v-row v-else-if="rooms.length === 0">
                    <v-col cols="12" class="text-center">
                        <v-icon size="64" color="grey">mdi-home-city</v-icon>
                        <p class="text-h6 mt-4">No tienes habitaciones registradas</p>
                        <p class="text-body-2 text-grey">Comienza agregando tu primera habitación</p>
                    </v-col>
                </v-row>

                <v-row v-else>
                    <v-col v-for="room in rooms" :key="room.id" cols="12" md="6" lg="4">
                        <v-card outlined>
                            <v-img :src="room.images?.[0] || '/placeholder-room.jpg'" height="200" cover></v-img>

                            <v-card-title>{{ room.title }}</v-card-title>
                            <v-card-subtitle>
                                <v-icon small>mdi-map-marker</v-icon>
                                {{ room.address }}
                            </v-card-subtitle>

                            <v-card-text>
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span class="text-h6 font-weight-bold">€{{ room.price }}/mes</span>
                                    <v-chip :color="getStatusColor(room.status)" small>
                                        {{ getStatusText(room.status) }}
                                    </v-chip>
                                </div>

                                <div class="d-flex justify-space-between text-caption text-grey">
                                    <span>{{ room.bedrooms }} habitaciones</span>
                                    <span>{{ room.bathrooms }} baños</span>
                                </div>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn text color="primary" @click="editRoom(room)">
                                    Editar
                                </v-btn>
                                <v-btn text color="error" @click="deleteRoom(room.id)">
                                    Eliminar
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn text color="info" @click="viewDetails(room.id)">
                                    Ver detalles
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row align="center" justify="end" class="w-100 ma-0 pa-0 add-room-btn-row">
                    <v-col cols="auto" class="pa-0">
                        <v-btn color="primary" @click="showAddRoomDialog = true">
                            <v-icon left>mdi-plus</v-icon>
                            Agregar Habitación
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Dialog para agregar/editar habitación -->
        <v-dialog v-model="showAddRoomDialog" max-width="600px">
            <v-card>
                <v-card-title>
                    {{ editingRoom ? 'Editar Habitación' : 'Agregar Nueva Habitación' }}
                </v-card-title>

                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-text-field v-model="roomForm.title" label="Título" required
                            :rules="[v => !!v || 'El título es requerido']"></v-text-field>

                        <v-textarea v-model="roomForm.description" label="Descripción" required
                            :rules="[v => !!v || 'La descripción es requerida']"></v-textarea>

                        <v-text-field v-model="roomForm.address" label="Dirección" required
                            :rules="[v => !!v || 'La dirección es requerida']"></v-text-field>

                        <v-row>
                            <v-col cols="6">
                                <v-text-field v-model.number="roomForm.price" label="Precio (€/mes)" type="number"
                                    required :rules="[v => v > 0 || 'El precio debe ser mayor a 0']"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model.number="roomForm.bedrooms" label="Habitaciones" type="number"
                                    required :rules="[v => v > 0 || 'Debe tener al menos 1 habitación']"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <v-text-field v-model.number="roomForm.bathrooms" label="Baños" type="number" required
                                    :rules="[v => v >= 0 || 'El número de baños no puede ser negativo']"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-select v-model="roomForm.status" :items="statusOptions" label="Estado"
                                    required></v-select>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showAddRoomDialog = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="saveRoom" :loading="saving">
                        {{ editingRoom ? 'Actualizar' : 'Guardar' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from '@/api/axios';

    const router = useRouter();

    // Estado reactivo
    const loading = ref(false);
    const saving = ref(false);
    const rooms = ref([]);
    const showAddRoomDialog = ref(false);
    const editingRoom = ref(null);
    const valid = ref(false);

    // Formulario
    const roomForm = ref({
        title: '',
        description: '',
        address: '',
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        status: 'available'
    });

    // Opciones de estado
    const statusOptions = [
        { text: 'Disponible', value: 'available' },
        { text: 'Ocupada', value: 'occupied' },
        { text: 'En mantenimiento', value: 'maintenance' },
        { text: 'Reservada', value: 'reserved' }
    ];

    // Métodos
    const getStatusColor = (status) => {
        const colors = {
            available: 'success',
            occupied: 'error',
            maintenance: 'warning',
            reserved: 'info'
        };
        return colors[status] || 'grey';
    };

    const getStatusText = (status) => {
        const texts = {
            available: 'Disponible',
            occupied: 'Ocupada',
            maintenance: 'Mantenimiento',
            reserved: 'Reservada'
        };
        return texts[status] || 'Desconocido';
    };

    const loadRooms = async () => {
        loading.value = true;
        try {
            const response = await axios.get('/rooms/landlord');
            rooms.value = response.data;
        } catch (error) {
            console.error('Error cargando habitaciones:', error);
        } finally {
            loading.value = false;
        }
    };

    const saveRoom = async () => {
        if (!valid.value) return;

        saving.value = true;
        try {
            if (editingRoom.value) {
                await axios.put(`/rooms/${editingRoom.value.id}`, roomForm.value);
            } else {
                await axios.post('/rooms', roomForm.value);
            }

            showAddRoomDialog.value = false;
            resetForm();
            await loadRooms();
        } catch (error) {
            console.error('Error guardando habitación:', error);
        } finally {
            saving.value = false;
        }
    };

    const editRoom = (room) => {
        editingRoom.value = room;
        roomForm.value = { ...room };
        showAddRoomDialog.value = true;
    };

    const deleteRoom = async (roomId) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
            try {
                await axios.delete(`/rooms/${roomId}`);
                await loadRooms();
            } catch (error) {
                console.error('Error eliminando habitación:', error);
            }
        }
    };

    const viewDetails = (roomId) => {
        router.push(`/room/${roomId}`);
    };

    const resetForm = () => {
        roomForm.value = {
            title: '',
            description: '',
            address: '',
            price: '',
            bedrooms: 1,
            bathrooms: 1,
            status: 'available'
        };
        editingRoom.value = null;
    };

    // Cargar habitaciones al montar el componente
    onMounted(() => {
        loadRooms();
    });
</script>

<style scoped>
    .rooms-section {
        padding: 20px;
    }

    .add-room-btn-row {
        border-top: 1px solid #eee;
        margin-top: 42px;
        padding-top: 12px;
    }
</style>