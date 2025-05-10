<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-row justify="center" align="center" class="w-100">
            <v-col cols="12" sm="8" md="4" lg="4" xl="3" class="d-flex justify-center">
                <v-card class="pa-6 login-card" elevation="6">
                    <v-card-title class="justify-center">
                        <span class="text-h5 font-weight-bold">Iniciar sesión</span>
                    </v-card-title>
                    <v-card-text>
                        <v-alert v-if="authStore.error" type="error" class="mb-4" dense border="start">
                            {{ authStore.error }}
                        </v-alert>
                        <v-form @submit.prevent="handleSubmit">
                            <v-text-field v-model="email" label="Email" type="email" required
                                prepend-inner-icon="mdi-email" class="mb-4" />
                            <v-text-field v-model="password" label="Contraseña" type="password" required
                                prepend-inner-icon="mdi-lock" class="mb-4" />
                            <v-btn :loading="authStore.loading" type="submit" color="primary" block large class="mt-2">
                                Iniciar sesión
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

    const email = ref('');
    const password = ref('');

    const handleSubmit = async () => {
        console.log("email.value", email.value);
        console.log("password.value", password.value);
        const success = await authStore.login(email.value, password.value);
        if (success) {
            router.push('/');
        }
    };
</script>

<style scoped>
    .login-card {
        min-width: 320px;
        max-width: 400px;
        width: 100%;
    }
</style>