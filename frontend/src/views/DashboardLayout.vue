<template>
    <v-container fluid class="pa-0">
        <v-row no-gutters>
            <!-- Sidebar -->
            <v-navigation-drawer app permanent width="250" class="dashboard-sidebar">
                <v-list dense>
                    <v-list-item v-for="item in menuItems" :key="item.title" :to="`/dashboard/${item.route}`" link exact
                        :active="$route.path === `/dashboard/${item.route}` || ($route.path === '/dashboard' && item.route === 'profile')"
                        class="dashboard-sidebar-item">
                        <v-list-item-icon>
                            <v-icon color="white">{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <!-- Main content  -->
            <v-main>
                <v-container>
                    <router-view />
                </v-container>
            </v-main>
        </v-row>
    </v-container>
</template>

<script setup>
    import { computed } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { useRoute } from 'vue-router';

    const authStore = useAuthStore();
    const $route = useRoute();

    const menuItems = computed(() => {
        if (authStore.user?.role === 'landlord') {
            return [
                { title: 'Mi perfil', icon: 'mdi-account', route: 'profile' },
                { title: 'Mis habitaciones', icon: 'mdi-home-city', route: 'rooms' },
                { title: 'Solicitudes de reserva', icon: 'mdi-email', route: 'requests' },
                { title: 'Contratos', icon: 'mdi-file-document', route: 'contracts' },
                { title: 'Pagos', icon: 'mdi-cash', route: 'payments' }
            ];
        }
        // Estudiante
        return [
            { title: 'Perfil', icon: 'mdi-account', route: 'profile' },
            { title: 'Favoritos', icon: 'mdi-heart', route: 'favorites' },
            { title: 'Reservas', icon: 'mdi-calendar-check', route: 'reservations' },
            { title: 'Contratos', icon: 'mdi-file-document', route: 'contracts' },
            { title: 'Pagos', icon: 'mdi-cash', route: 'payments' },
            { title: 'Configuración', icon: 'mdi-cog', route: 'settings' }
        ];
    });
</script>

<style scoped>
    .dashboard-sidebar {
        background-color: #23272f !important;
        /* Gris muy oscuro */
    }

    .dashboard-sidebar-item {
        color: #fff !important;
    }

    .dashboard-sidebar-item .v-list-item-title {
        color: #fff !important;
    }
</style>