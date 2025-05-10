<template>
    <v-container fluid class="pa-0">
        <v-row no-gutters>
            <!-- Sidebar -->
            <v-navigation-drawer app permanent width="220">
                <v-list dense>
                    <v-list-item v-for="item in menuItems" :key="item.title" :to="item.route"
                        :active="selected === item.route" @click="selected = item.route" link>
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <!-- Main content -->
            <v-main>
                <v-container>
                    <component :is="selectedComponent" />
                </v-container>
            </v-main>
        </v-row>
    </v-container>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useAuthStore } from '@/store/auth';
    // Importa aquí los componentes de cada sección (pueden ser placeholders al principio)
    import ProfileSection from './dashboard/ProfileSection.vue';
    import FavoritesSection from './dashboard/FavoritesSection.vue';
    import ReservationsSection from './dashboard/ReservationsSection.vue';
    import ContractsSection from './dashboard/ContractsSection.vue';
    import PaymentsSection from './dashboard/PaymentsSection.vue';

    const authStore = useAuthStore();
    const selected = ref('profile');

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
            { title: 'Mi perfil', icon: 'mdi-account', route: 'profile' },
            { title: 'Favoritos', icon: 'mdi-heart', route: 'favorites' },
            { title: 'Mis reservas', icon: 'mdi-calendar-check', route: 'reservations' },
            { title: 'Mis contratos', icon: 'mdi-file-document', route: 'contracts' },
            { title: 'Mis pagos', icon: 'mdi-cash', route: 'payments' }
        ];
    });

    const selectedComponent = computed(() => {
        switch (selected.value) {
            case 'profile': return ProfileSection;
            case 'favorites': return FavoritesSection;
            case 'reservations': return ReservationsSection;
            case 'contracts': return ContractsSection;
            case 'payments': return PaymentsSection;
            // ...y así para cada sección
            default: return ProfileSection;
        }
    });
</script>