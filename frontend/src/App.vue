<script setup>
  import { useAuthStore } from '@/store/auth';
  import { computed } from 'vue';

  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);

  const handleLogout = async () => {
    await authStore.logout();
  };
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none text-white">
          Student Rentals
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>



      <!-- Botones de autenticación para usuarios no logueados -->
      <template v-if="!isAuthenticated">
        <v-btn to="/login" variant="text" class="text-white">
          Iniciar sesión
        </v-btn>
        <v-btn to="/register" color="white" variant="flat" class="ml-2">
          Registrarse
        </v-btn>
      </template>

      <!-- Menú de usuario para usuarios logueados -->
      <template v-else>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon>
              <v-avatar size="32" color="white">
                <span class="text-primary">{{ user?.name?.[0]?.toUpperCase() || 'U' }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard">
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item to="/profile" prepend-icon="mdi-account">
              <v-list-item-title>Mi perfil</v-list-item-title>
            </v-list-item>
            <v-list-item to="/favorites" prepend-icon="mdi-heart">
              <v-list-item-title>Favoritos</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="handleLogout" prepend-icon="mdi-logout">
              <v-list-item-title>Cerrar sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app color="primary" class="text-center d-flex justify-center">
      <span class="text-white">© {{ new Date().getFullYear() }} Student Rentals</span>
    </v-footer>
  </v-app>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

  .v-application {
    font-family: 'Roboto', sans-serif !important;
  }

  .text-decoration-none {
    text-decoration: none;
  }
</style>