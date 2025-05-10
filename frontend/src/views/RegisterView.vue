<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-row justify="center" align="center" class="w-100">
            <v-col cols="12" sm="8" md="5" lg="4" xl="3" class="d-flex justify-center">
                <v-card class="pa-6 register-card" elevation="6">
                    <v-card-title class="justify-center">
                        <span class="text-h5 font-weight-bold">Registrarse</span>
                    </v-card-title>
                    <v-card-text>
                        <v-alert v-if="authStore.error" type="error" class="mb-4" dense border="start">
                            {{ authStore.error }}
                        </v-alert>
                        <v-form @submit.prevent="handleSubmit">
                            <v-text-field v-model="formData.full_name" label="Nombre completo" required
                                prepend-inner-icon="mdi-account" class="mb-3" />
                            <v-text-field v-model="formData.email" label="Email" type="email" required
                                prepend-inner-icon="mdi-email" class="mb-3" />
                            <v-text-field v-model="formData.password" label="Contraseña" type="password" required
                                prepend-inner-icon="mdi-lock" class="mb-3" />
                            <v-text-field v-model="formData.phone" label="Teléfono" type="tel"
                                prepend-inner-icon="mdi-phone" class="mb-3" />
                            <v-select v-model="formData.role" :items="roles" label="Tipo de usuario" required
                                prepend-inner-icon="mdi-account-switch" class="mb-3" />
                            <v-btn :loading="authStore.loading" type="submit" color="primary" block large class="mt-2">
                                Registrarse
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/store/auth';

    const router = useRouter();
    const authStore = useAuthStore();

    const formData = ref({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: ''
    });

    const roles = [
        { title: 'Estudiante', value: 'student' },
        { title: 'Propietario', value: 'landlord' }
    ];

    const handleSubmit = async () => {
        const success = await authStore.register(formData.value);
        if (success) {
            router.push('/');
        }
    };
</script>

<style scoped>
    .register-card {
        min-width: 320px;
        max-width: 400px;
        width: 100%;
    }
</style>