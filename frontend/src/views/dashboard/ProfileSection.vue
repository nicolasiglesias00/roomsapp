<template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-6 text-center">Mi perfil</h2>
        <v-card class="pa-6" style="max-width: 1600px; width: 100%; margin: 0 auto;">
            <v-form @submit.prevent="updateProfile">
                <v-row>
                    <v-col cols="12" class="d-flex justify-center mb-4">
                        <v-avatar size="100">
                            <v-img
                                :src="form.avatar || authStore.user?.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png'" />
                        </v-avatar>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.name" label="Nombre" required />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.surname" label="Apellidos" required />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.email" label="Email" type="email" required />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.phone" label="Teléfono" type="tel" />
                    </v-col>
                    <v-col cols="12">
                        <v-file-input v-model="form.avatar" label="Foto de perfil" accept="image/*"
                            prepend-icon="mdi-camera" />
                    </v-col>
                </v-row>
                <v-divider class="my-6" />
                <h3 class="text-h6 mb-4">Preferencias</h3>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-switch v-model="preferences.notifications" label="Notificaciones" color="primary"
                            prepend-icon="mdi-bell" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="preferences.newsletter" label="Newsletter" color="primary"
                            prepend-icon="mdi-email" />
                    </v-col>
                </v-row>
                <v-divider class="my-6" />
                <v-row justify="end">
                    <v-btn color="primary" type="submit">Guardar cambios</v-btn>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useAuthStore } from '@/store/auth';

    const authStore = useAuthStore();
    const form = ref({
        name: '',
        surname: '',
        email: '',
        phone: '',
        avatar: null
    });
    const preferences = ref({
        notifications: true,
        newsletter: false
    });

    // Cargar perfil si no está cargado pero hay token
    onMounted(async () => {
        if (!authStore.user && authStore.token) {
            await authStore.fetchProfile();
        }
    });

    // Rellenar el formulario cuando el usuario esté disponible
    watch(
        () => authStore.user,
        (user) => {
            if (user) {
                form.value = {
                    name: user.name || user.full_name || '',
                    surname: user.surname || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    avatar: null // Para subida nueva, la actual se muestra con user.avatar
                };
            }
        },
        { immediate: true }
    );

    const updateProfile = async () => {
        // Lógica para guardar cambios
        await authStore.updateProfile(form.value);
        await authStore.updatePreferences(preferences.value);
    };


</script>













































<!-- <template>
    <v-container>
        <v-row justify="center">

            <v-card class="pa-6">

                <v-form @submit.prevent="updateProfile">
                    <v-form-title>
                        <h2 class="text-h5 font-weight-bold mb-6 text-center">Mi perfil</h2>
                    </v-form-title>
                    <v-row>
                        <v-col cols="12" class="d-flex justify-center mb-4">
                            <v-avatar size="80">
                                <v-img :src="form.avatar || '/default-avatar.png'" />
                            </v-avatar>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name" label="Nombre" required />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.surname" label="Apellidos" required />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.email" label="Email" type="email" required />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.phone" label="Teléfono" type="tel" />
                        </v-col>
                        <v-col cols="12">
                            <v-file-input v-model="form.avatar" label="Foto de perfil" accept="image/*"
                                prepend-icon="mdi-camera" />
                        </v-col>
                    </v-row>
                    <v-divider class="my-6" />
                    <h3 class="text-h6 mb-4">Preferencias</h3>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-switch v-model="preferences.notifications" label="Notificaciones" color="primary"
                                prepend-icon="mdi-bell" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-switch v-model="preferences.newsletter" label="Newsletter" color="primary"
                                prepend-icon="mdi-email" />
                        </v-col>
                    </v-row>
                    <v-divider class="my-6" />
                    <v-row justify="end">
                        <v-btn color="primary" type="submit">Guardar cambios</v-btn>
                    </v-row>
                </v-form>
            </v-card>

        </v-row>
    </v-container>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useAuthStore } from '@/store/auth';

    const authStore = useAuthStore();

    const form = ref({
        name: '',
        surname: '',
        email: '',
        phone: '',
        avatar: null
    });

    const preferences = ref({
        notifications: true,
        newsletter: false
    });

    onMounted(() => {
        if (authStore.user) {
            form.value = {
                name: authStore.user.name || '',
                surname: authStore.user.surname || '',
                email: authStore.user.email || '',
                phone: authStore.user.phone || '',
                avatar: authStore.user.avatar || null
            };
            // Cargar preferencias reales si las tienes
        }
    });

    const updateProfile = async () => {
        // Lógica para guardar cambios
        await authStore.updateProfile(form.value);
        await authStore.updatePreferences(preferences.value);
    };
</script> -->