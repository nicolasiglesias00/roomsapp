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
                        <div class="empty-state-container">
                            <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-home-city</v-icon>
                            <h3 class="text-h5 font-weight-medium mb-3 text-grey-darken-1">No tienes habitaciones
                                registradas</h3>
                            <p class="text-body-1 text-grey mb-6">Comienza agregando tu primera habitación</p>
                            <v-divider class="mb-6 mx-auto" style="max-width: 200px;"></v-divider>
                            <v-btn color="primary" size="large" @click="showAddRoomDialog = true" class="px-8"
                                elevation="2">
                                <v-icon left class="mr-2">mdi-plus</v-icon>
                                Agregar Habitación
                            </v-btn>
                        </div>
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
                                    <span class="text-h6 font-weight-bold">€{{ room.monthly_price }}/mes</span>
                                    <v-chip :color="getStatusColor(room.status)" small>
                                        {{ getStatusText(room.status) }}
                                    </v-chip>
                                </div>

                                <div class="d-flex justify-space-between text-caption text-grey mb-2">
                                    <span>{{ room.square_meters }}m²</span>
                                    <span>{{ room.number_of_rooms }} habitación{{ room.number_of_rooms > 1 ? 'es' : ''
                                        }}</span>
                                </div>

                                <div class="d-flex justify-space-between text-caption text-grey mb-2"
                                    v-if="room.nearby_university">
                                    <span class="text-caption">
                                        <v-icon x-small>mdi-school</v-icon>
                                        {{ room.nearby_university }}
                                    </span>
                                </div>

                                <div class="d-flex flex-wrap gap-1">
                                    <v-chip v-if="room.private_bathroom" x-small color="primary">Baño privado</v-chip>
                                    <v-chip v-if="room.wifi" x-small color="success">WiFi</v-chip>
                                    <v-chip v-if="room.furnished" x-small color="info">Amueblada</v-chip>
                                    <v-chip v-if="room.utilities_included" x-small color="warning">Servicios
                                        incluidos</v-chip>
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

            </v-card-text>
        </v-card>

        <!-- Dialog para agregar/editar habitación -->
        <v-dialog v-model="showAddRoomDialog" max-width="800px">
            <v-card>
                <v-card-title>
                    {{ editingRoom ? 'Editar Habitación' : 'Agregar Nueva Habitación' }}
                </v-card-title>

                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="roomForm.title" label="Título" required
                                    :rules="[v => !!v || 'El título es requerido']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="roomForm.monthly_price" label="Precio mensual (€)" type="number"
                                    required :rules="[v => v > 0 || 'El precio debe ser mayor a 0']"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-textarea v-model="roomForm.description" label="Descripción" required
                            :rules="[v => !!v || 'La descripción es requerida']" rows="3"></v-textarea>

                        <v-text-field v-model="roomForm.address" label="Dirección" required
                            :rules="[v => !!v || 'La dirección es requerida']"></v-text-field>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="roomForm.square_meters" label="Metros cuadrados"
                                    type="number" required
                                    :rules="[v => v > 0 || 'Los metros cuadrados deben ser mayores a 0']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="roomForm.number_of_rooms" label="Número de habitaciones"
                                    type="number" required
                                    :rules="[v => v > 0 || 'Debe tener al menos 1 habitación']"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-menu v-model="showDateFromMenu" :close-on-content-click="false">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="roomForm.available_from" label="Disponible desde"
                                            readonly v-bind="props" prepend-icon="mdi-calendar"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="roomForm.available_from"
                                        @update:model-value="showDateFromMenu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu v-model="showDateUntilMenu" :close-on-content-click="false">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="roomForm.available_until" label="Disponible hasta"
                                            readonly v-bind="props" prepend-icon="mdi-calendar"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="roomForm.available_until"
                                        @update:model-value="showDateUntilMenu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-switch v-model="roomForm.utilities_included" label="Servicios incluidos en el precio"
                                    color="primary" hide-details></v-switch>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="roomForm.status" :items="statusOptions" label="Estado" required
                                    item-title="text" item-value="value"></v-select>
                            </v-col>
                        </v-row>



                        <!-- Utilidades -->
                        <v-card outlined class="mt-4">
                            <v-card-title class="text-subtitle-1">Utilidades y Servicios</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col v-for="utility in utilitiesList" :key="utility.value" cols="12" md="6"
                                        lg="4">
                                        <v-checkbox v-model="roomForm.utilities" :value="utility.value"
                                            :label="utility.text" color="primary"></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <!-- Subida de imágenes -->
                        <v-card outlined class="mt-4">
                            <v-card-title class="text-subtitle-1">Imágenes de la habitación</v-card-title>
                            <v-card-text>
                                <v-file-input v-model="selectedImages" multiple accept="image/*"
                                    label="Seleccionar imágenes" prepend-icon="mdi-camera"
                                    @change="handleImageSelection"
                                    :rules="[v => !v || v.length <= 10 || 'Máximo 10 imágenes']"></v-file-input>

                                <v-row v-if="imagePreviewUrls.length > 0">
                                    <v-col v-for="(url, index) in imagePreviewUrls" :key="index" cols="12" md="4"
                                        lg="3">
                                        <v-card outlined>
                                            <v-img :src="url" height="150" cover></v-img>
                                            <v-card-actions class="pa-2">
                                                <v-btn icon small color="error" @click="removeImage(index)">
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <v-row v-if="editingRoom && editingRoom.images && editingRoom.images.length > 0">
                                    <v-col cols="12">
                                        <p class="text-subtitle-2 mb-2">Imágenes existentes:</p>
                                    </v-col>
                                    <v-col v-for="(image, index) in editingRoom.images" :key="index" cols="12" md="4"
                                        lg="3">
                                        <v-card outlined>
                                            <v-img :src="image" height="150" cover></v-img>
                                            <v-card-actions class="pa-2">
                                                <v-btn icon small color="error" @click="removeExistingImage(index)">
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
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
    const showDateFromMenu = ref(false);
    const showDateUntilMenu = ref(false);
    const selectedImages = ref([]);
    const imagePreviewUrls = ref([]);

    // Formulario actualizado
    const roomForm = ref({
        title: '',
        description: '',
        monthly_price: '',
        utilities_included: false,
        address: '',
        square_meters: '',
        private_bathroom: false,
        wifi: false,
        furnished: false,
        available_from: '',
        available_until: '',
        nearby_university: '',
        status: 'available',
        utilities: [],
        number_of_rooms: 1
    });

    // Opciones de estado actualizadas
    const statusOptions = [
        { text: 'Disponible', value: 'available' },
        { text: 'Reservada', value: 'booked' },
        { text: 'Ocupada', value: 'occupied' }
    ];

    // Lista de utilidades
    const utilitiesList = [
        { text: 'Electricidad', value: 'electricity' },
        { text: 'Agua', value: 'water' },
        { text: 'WiFi', value: 'wifi' },
        { text: 'Limpieza semanal', value: 'weekly_cleaning' },
        { text: 'Gas', value: 'gas' },
        { text: 'Aire acondicionado', value: 'air_conditioning' },
        { text: 'Calefacción', value: 'heating' },
        { text: 'Lavadora', value: 'washing_machine' },
        { text: 'Secadora', value: 'dryer' },
        { text: 'Televisión', value: 'tv' },
        { text: 'Terraza', value: 'terrace' },
        { text: 'Balcón', value: 'balcony' },
        { text: 'Escritorio', value: 'desk' },
        { text: 'Armario', value: 'wardrobe' },
        { text: 'Baño privado', value: 'private_bathroom' },
        { text: 'Toallas', value: 'towels' },
        { text: 'Ropa de cama', value: 'bedding' },
        { text: 'Ascensor', value: 'elevator' },
        { text: 'Acceso para discapacitados', value: 'disabled_access' },
        { text: 'Parking para bicicleta', value: 'bike_parking' },
        { text: 'Parking privado', value: 'private_parking' },
        { text: 'Zonas comunes', value: 'common_areas' },
        { text: 'Piscina', value: 'pool' },
        { text: 'Gimnasio', value: 'gym' },
        { text: 'Cocina compartida', value: 'shared_kitchen' }
    ];

    // Métodos
    const getStatusColor = (status) => {
        const colors = {
            available: 'success',
            booked: 'info',
            occupied: 'error'
        };
        return colors[status] || 'grey';
    };

    const getStatusText = (status) => {
        const texts = {
            available: 'Disponible',
            booked: 'Reservada',
            occupied: 'Ocupada'
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

    const handleImageSelection = (files) => {
        if (!files) {
            imagePreviewUrls.value = [];
            return;
        }

        imagePreviewUrls.value = [];
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewUrls.value.push(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        imagePreviewUrls.value.splice(index, 1);
        selectedImages.value.splice(index, 1);
    };

    const removeExistingImage = (index) => {
        if (editingRoom.value && editingRoom.value.images) {
            editingRoom.value.images.splice(index, 1);
        }
    };

    const saveRoom = async () => {
        if (!valid.value) return;

        saving.value = true;
        try {
            const formData = new FormData();

            // Agregar campos del formulario
            Object.keys(roomForm.value).forEach(key => {
                if (key === 'utilities') {
                    formData.append(key, JSON.stringify(roomForm.value[key]));
                } else {
                    formData.append(key, roomForm.value[key]);
                }
            });

            // Agregar imágenes seleccionadas
            if (selectedImages.value.length > 0) {
                selectedImages.value.forEach((file, index) => {
                    formData.append(`images`, file);
                });
            }

            if (editingRoom.value) {
                await axios.put(`/rooms/${editingRoom.value.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('/rooms', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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
        roomForm.value = {
            title: room.title || '',
            description: room.description || '',
            monthly_price: room.monthly_price || '',
            utilities_included: room.utilities_included === 1 || room.utilities_included === true,
            address: room.address || '',
            square_meters: room.square_meters || '',
            private_bathroom: room.private_bathroom === 1 || room.private_bathroom === true,
            wifi: room.wifi === 1 || room.wifi === true,
            furnished: room.furnished === 1 || room.furnished === true,
            available_from: room.available_from || '',
            available_until: room.available_until || '',
            nearby_university: room.nearby_university || '',
            status: room.status || 'available',
            utilities: room.utilities ? JSON.parse(room.utilities) : [],
            number_of_rooms: room.number_of_rooms || 1
        };
        selectedImages.value = [];
        imagePreviewUrls.value = [];
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
            monthly_price: '',
            utilities_included: false,
            address: '',
            square_meters: '',
            private_bathroom: false,
            wifi: false,
            furnished: false,
            available_from: '',
            available_until: '',
            nearby_university: '',
            status: 'available',
            utilities: [],
            number_of_rooms: 1
        };
        editingRoom.value = null;
        selectedImages.value = [];
        imagePreviewUrls.value = [];
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

    /* Estilos para el estado vacío */
    .empty-state-container {
        padding: 40px 20px;
        max-width: 500px;
        margin: 0 auto;
    }

    /* Mejorar la apariencia general de las cards */
    :deep(.v-card) {
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    :deep(.v-card:hover) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    :deep(.v-card-title) {
        font-weight: 600;
        color: #2c3e50;
    }

    :deep(.v-card-subtitle) {
        color: #7f8c8d;
    }

    /* Estilos personalizados para los switches */
    :deep(.v-switch .v-switch__track) {
        opacity: 0.3;
    }

    :deep(.v-switch--active .v-switch__track) {
        opacity: 0.8;
    }

    :deep(.v-switch .v-switch__thumb) {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    :deep(.v-switch--active .v-switch__thumb) {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    }

    /* Mejorar la visibilidad de los checkboxes de utilidades */
    :deep(.v-checkbox .v-selection-control__wrapper) {
        margin-right: 8px;
    }

    :deep(.v-checkbox--selected .v-selection-control__wrapper) {
        background-color: rgb(var(--v-theme-primary));
        border-color: rgb(var(--v-theme-primary));
    }

    :deep(.v-checkbox--selected .v-selection-control__input) {
        color: white;
    }

    :deep(.v-checkbox--selected .v-selection-control__wrapper .v-icon) {
        color: white;
    }
</style>