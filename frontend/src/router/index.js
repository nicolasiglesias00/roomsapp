import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home.vue')
        },
        {
            path: '/room/:id',
            name: 'room-details',
            component: () => import('@/views/RoomDetails.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/dashboard',
            component: () => import('@/views/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'dashboard-home', component: () => import('@/views/dashboard/ProfileSection.vue') },
                { path: 'profile', name: 'dashboard-profile', component: () => import('@/views/dashboard/ProfileSection.vue') },
                { path: 'favorites', name: 'dashboard-favorites', component: () => import('@/views/dashboard/FavoritesSection.vue') },
                { path: 'reservations', name: 'dashboard-reservations', component: () => import('@/views/dashboard/ReservationsSection.vue') },
                { path: 'contracts', name: 'dashboard-contracts', component: () => import('@/views/dashboard/ContractsSection.vue') },
                { path: 'payments', name: 'dashboard-payments', component: () => import('@/views/dashboard/PaymentsSection.vue') }
            ]
        }
    ]
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;