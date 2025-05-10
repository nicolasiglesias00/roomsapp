<template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-4">Favoritos</h2>
        <v-alert v-if="favoritesStore.favorites.length === 0 && !favoritesStore.loading" type="info" border="start"
            class="mb-4">
            No tienes habitaciones favoritas.
        </v-alert>
        <v-row v-else>
            <v-col v-for="fav in favoritesStore.favorites" :key="fav.id" cols="12" md="6" lg="4">
                <v-card class="mx-auto w-100" elevation="2">
                    <v-img :src="fav.room.image" height="180px" cover />
                    <v-card-title>
                        <router-link :to="`/room/${fav.room.id}`" class="text-decoration-none">
                            {{ fav.room.title }}
                        </router-link>
                    </v-card-title>
                    <v-card-text>
                        <div>
                            <strong>Precio:</strong> {{ fav.room.monthly_price }} €/mes
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="outlined" :to="`/room/${fav.room.id}`">
                            <v-icon start>mdi-eye</v-icon>
                            Ver habitación
                        </v-btn>
                        <!-- Aquí podrías poner un botón para quitar de favoritos en el futuro -->
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-progress-linear v-if="favoritesStore.loading" indeterminate color="primary" class="mt-4" />
        <v-alert v-if="favoritesStore.error" type="error" class="mt-4">
            {{ favoritesStore.error }}
        </v-alert>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { useFavoritesStore } from '@/store/favorites';

    const authStore = useAuthStore();
    const favoritesStore = useFavoritesStore();

    onMounted(() => {
        if (authStore.token) {
            favoritesStore.fetchFavorites(authStore.token);
        }
    });
</script>

<style scoped>
    .text-decoration-none {
        text-decoration: none;
        color: inherit;
    }
</style>