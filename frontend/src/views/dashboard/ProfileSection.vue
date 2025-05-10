<template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-6 text-center">Mi perfil</h2>
        <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" md="8" lg="6" xl="5">
                <v-card class="pa-6" style="max-width: 700px; width: 100%; margin: 0 auto;">
                    <v-form @submit.prevent="updateProfile">
                        <v-row>
                            <v-col cols="12" class="d-flex justify-center mb-4">
                                <v-avatar size="100">
                                    <v-img :src="form.avatar || user.avatar || '/default-avatar.png'" />
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
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useAuthStore } from '@/store/auth';

    const authStore = useAuthStore();
    const user = authStore.user;

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
        if (user) {
            form.value = {
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: null // Solo para subida nueva, la actual se muestra con user.avatar
            };
            // Cargar preferencias reales si las tienes
        }
        else {
            console.log("No hay usuario");
            form.value = {
                name: 'aaa',
                surname: 'aaa',
                email: 'aaa',
                phone: 'aaa',
                avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffree-png-vectors%2Fwoman-avatar&psig=AOvVaw2NM-PFaogpvGg2-ralEKW9&ust=1746957153675000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLD0sNbQmI0DFQAAAAAdAAAAABAE'
            }
        }
    });

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