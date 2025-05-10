<template>
    <v-container>
        <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <div v-else-if="error" class="text-center pa-4">
            <v-alert type="error" :text="error"></v-alert>
        </div>

        <template v-else-if="room">
            <v-row>
                <!-- Galería de imágenes -->
                <v-col cols="12">
                    <v-carousel v-if="room.images.length > 0" height="400" hide-delimiter-background
                        show-arrows="hover">
                        <v-carousel-item v-for="(image, i) in room.images" :key="i" :src="image"
                            cover></v-carousel-item>
                    </v-carousel>
                    <v-img v-else src="/placeholder-room.jpg" height="400" cover></v-img>
                </v-col>

                <!-- Información principal -->
                <v-col cols="12" md="8">
                    <v-card>
                        <v-card-title class="text-h4">
                            {{ room.title }}
                        </v-card-title>

                        <v-card-text>
                            <div class="d-flex align-center mb-4">
                                <v-icon icon="mdi-currency-eur" class="mr-1"></v-icon>
                                <span class="text-h5 font-weight-bold">{{ room.monthly_price }}€/mes</span>
                            </div>

                            <div class="d-flex align-center mb-2">
                                <v-icon icon="mdi-map-marker" class="mr-1"></v-icon>
                                <span>{{ room.address }}</span>
                            </div>

                            <div class="d-flex align-center mb-4">
                                <v-icon icon="mdi-school" class="mr-1"></v-icon>
                                <span>{{ room.nearby_university }}</span>
                            </div>

                            <v-divider class="mb-4"></v-divider>

                            <h3 class="text-h6 mb-2">Descripción</h3>
                            <p class="text-body-1">{{ room.description }}</p>

                            <v-divider class="my-4"></v-divider>

                            <h3 class="text-h6 mb-2">Características</h3>
                            <v-row>
                                <v-col cols="6" sm="4">
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-icon :icon="room.features.private_bathroom ? 'mdi-check' : 'mdi-close'"
                                                :color="room.features.private_bathroom ? 'success' : 'error'"></v-icon>
                                        </template>
                                        <v-list-item-title>Baño privado</v-list-item-title>
                                    </v-list-item>
                                </v-col>
                                <v-col cols="6" sm="4">
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-icon :icon="room.features.wifi ? 'mdi-check' : 'mdi-close'"
                                                :color="room.features.wifi ? 'success' : 'error'"></v-icon>
                                        </template>
                                        <v-list-item-title>WiFi</v-list-item-title>
                                    </v-list-item>
                                </v-col>
                                <v-col cols="6" sm="4">
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-icon :icon="room.features.furnished ? 'mdi-check' : 'mdi-close'"
                                                :color="room.features.furnished ? 'success' : 'error'"></v-icon>
                                        </template>
                                        <v-list-item-title>Amueblado</v-list-item-title>
                                    </v-list-item>
                                </v-col>
                            </v-row>

                            <v-divider class="my-4"></v-divider>

                            <h3 class="text-h6 mb-2">Servicios incluidos</h3>
                            <v-chip-group>
                                <v-chip v-for="utility in room.utilities" :key="utility" color="primary"
                                    variant="outlined">
                                    {{ utility }}
                                </v-chip>
                            </v-chip-group>
                        </v-card-text>
                    </v-card>
                </v-col>

                <!-- Sidebar con información del propietario y botón de reserva -->
                <v-col cols="12" md="4">
                    <v-card class="mb-4">
                        <v-card-title>Información del propietario</v-card-title>
                        <v-card-text>
                            <div class="d-flex align-center mb-2">
                                <v-icon icon="mdi-account" class="mr-2"></v-icon>
                                <span>{{ room.landlord.name }}</span>
                            </div>
                            <div class="d-flex align-center mb-2">
                                <v-icon icon="mdi-phone" class="mr-2"></v-icon>
                                <span>{{ room.landlord.phone }}</span>
                            </div>
                            <div class="d-flex align-center">
                                <v-icon icon="mdi-email" class="mr-2"></v-icon>
                                <span>{{ room.landlord.email }}</span>
                            </div>
                        </v-card-text>
                    </v-card>

                    <v-card>
                        <v-card-text>
                            <div class="text-center mb-4">
                                <div class="text-h6 mb-2">Disponibilidad</div>
                                <div class="text-body-2">
                                    Desde: {{ new Date(room.availability.from).toLocaleDateString() }}
                                </div>
                                <div class="text-body-2">
                                    Hasta: {{ new Date(room.availability.until).toLocaleDateString() }}
                                </div>
                            </div>

                            <v-btn block color="primary" size="large" :disabled="room.status !== 'available'"
                                @click="handleReservation">
                                {{ room.status === 'available' ? 'Reservar ahora' : 'No disponible' }}
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script setup>
    import { onMounted, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useRoomsStore } from '../store/rooms';

    const route = useRoute();
    const store = useRoomsStore();

    const room = computed(() => store.currentRoom);
    const loading = computed(() => store.loading);
    const error = computed(() => store.error);

    const handleReservation = () => {
        // TODO: Implementar lógica de reserva
        console.log('Reservar habitación:', room.value.id);
    };

    onMounted(async () => {
        await store.fetchRoomById(route.params.id);
    });
</script>