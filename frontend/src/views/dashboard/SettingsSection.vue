<template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-4">Configuración</h2>
        <v-card class="pa-6" style="max-width: 800px; margin: 0 auto;">
            <v-form @submit.prevent="saveSettings">
                <v-row>
                    <!-- Notificaciones -->
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.notifications_email" label="Notificaciones por email"
                            color="primary" prepend-icon="mdi-email" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.notifications_sms" label="Notificaciones por SMS" color="primary"
                            prepend-icon="mdi-cellphone" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.notifications_push" label="Notificaciones push" color="primary"
                            prepend-icon="mdi-bell" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.newsletter" label="Suscribirse a la newsletter" color="primary"
                            prepend-icon="mdi-newspaper" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.notify_new_rooms" label="Avisos de nuevas habitaciones"
                            color="primary" prepend-icon="mdi-home-search" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.notify_reservation_changes" label="Avisos de cambios en reservas"
                            color="primary" prepend-icon="mdi-calendar-check" />
                    </v-col>

                    <!-- Privacidad -->
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.profile_visible" label="Mostrar mi perfil a otros" color="primary"
                            prepend-icon="mdi-account-eye" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.allow_chat" label="Permitir mensajes privados" color="primary"
                            prepend-icon="mdi-chat" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.show_ratings" label="Permitir que vean mis valoraciones"
                            color="primary" prepend-icon="mdi-star" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.hide_phone" label="Ocultar mi teléfono" color="primary"
                            prepend-icon="mdi-phone-off" />
                    </v-col>

                    <!-- Seguridad -->
                    <v-col cols="12" md="6">
                        <v-btn color="secondary" variant="outlined" @click="changePassword">
                            <v-icon start>mdi-lock-reset</v-icon>
                            Cambiar contraseña
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.two_factor" label="Activar verificación en dos pasos"
                            color="primary" prepend-icon="mdi-shield-key" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn color="secondary" variant="outlined" @click="manageSessions">
                            <v-icon start>mdi-laptop" </v-icon>
                            Gestionar sesiones activas
                        </v-btn>
                    </v-col>

                    <!-- Preferencias generales -->
                    <v-col cols="12" md="6">
                        <v-select v-model="settings.language" :items="languages" label="Idioma"
                            prepend-icon="mdi-translate" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="settings.theme" :items="themes" label="Tema"
                            prepend-icon="mdi-theme-light-dark" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="settings.date_format" :items="dateFormats" label="Formato de fecha"
                            prepend-icon="mdi-calendar" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="settings.timezone" :items="timezones" label="Zona horaria"
                            prepend-icon="mdi-earth" />
                    </v-col>

                    <!-- Accesibilidad -->
                    <v-col cols="12" md="6">
                        <v-select v-model="settings.font_size" :items="fontSizes" label="Tamaño de fuente"
                            prepend-icon="mdi-format-size" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.high_contrast" label="Contraste alto" color="primary"
                            prepend-icon="mdi-contrast" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.reduce_animations" label="Reducir animaciones" color="primary"
                            prepend-icon="mdi-motion-pause" />
                    </v-col>

                    <!-- Cuenta -->
                    <v-col cols="12" md="6">
                        <v-btn color="error" variant="outlined" @click="deleteAccount">
                            <v-icon start>mdi-account-remove</v-icon>
                            Eliminar cuenta
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn color="secondary" variant="outlined" @click="downloadData">
                            <v-icon start>mdi-download</v-icon>
                            Descargar mis datos
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="my-6" />
                <v-row justify="end">
                    <v-btn color="primary" type="submit">Guardar configuración</v-btn>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const settings = ref({
        notifications_email: true,
        notifications_sms: false,
        notifications_push: true,
        newsletter: false,
        notify_new_rooms: true,
        notify_reservation_changes: true,
        profile_visible: true,
        allow_chat: true,
        show_ratings: true,
        hide_phone: false,
        two_factor: false,
        language: 'es',
        theme: 'light',
        date_format: 'dd/MM/yyyy',
        timezone: 'Europe/Madrid',
        font_size: 'normal',
        high_contrast: false,
        reduce_animations: false
    });

    const languages = [
        { title: 'Español', value: 'es' },
        { title: 'English', value: 'en' }
    ];

    const themes = [
        { title: 'Claro', value: 'light' },
        { title: 'Oscuro', value: 'dark' },
        { title: 'Sistema', value: 'system' }
    ];

    const dateFormats = [
        { title: 'dd/MM/yyyy', value: 'dd/MM/yyyy' },
        { title: 'MM/dd/yyyy', value: 'MM/dd/yyyy' },
        { title: 'yyyy-MM-dd', value: 'yyyy-MM-dd' }
    ];

    const timezones = [
        { title: 'Madrid (Europe/Madrid)', value: 'Europe/Madrid' },
        { title: 'Londres (Europe/London)', value: 'Europe/London' },
        { title: 'Nueva York (America/New_York)', value: 'America/New_York' }
    ];

    const fontSizes = [
        { title: 'Normal', value: 'normal' },
        { title: 'Grande', value: 'large' },
        { title: 'Extra grande', value: 'x-large' }
    ];

    function saveSettings() {
        // Aquí iría la lógica para guardar la configuración (API o localStorage)
        alert('Configuración guardada:\n' + JSON.stringify(settings.value, null, 2));
    }

    function changePassword() {
        alert('Funcionalidad para cambiar contraseña');
    }

    function manageSessions() {
        alert('Funcionalidad para gestionar sesiones activas');
    }

    function deleteAccount() {
        alert('Funcionalidad para eliminar cuenta');
    }

    function downloadData() {
        alert('Funcionalidad para descargar datos personales');
    }
</script>


<!-- <template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-4">Configuración</h2>
        <v-card class="pa-6" style="max-width: 600px; margin: 0 auto;">
            <v-form @submit.prevent="saveSettings">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.notifications" label="Recibir notificaciones por email"
                            color="primary" prepend-icon="mdi-email" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-switch v-model="settings.newsletter" label="Suscribirse a la newsletter" color="primary"
                            prepend-icon="mdi-newspaper" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="settings.language" :items="languages" label="Idioma"
                            prepend-icon="mdi-translate" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="settings.theme" :items="themes" label="Tema"
                            prepend-icon="mdi-theme-light-dark" />
                    </v-col>
                </v-row>
                <v-divider class="my-6" />
                <v-row justify="end">
                    <v-btn color="primary" type="submit">Guardar configuración</v-btn>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const settings = ref({
        notifications: true,
        newsletter: false,
        language: 'es',
        theme: 'light'
    });

    const languages = [
        { title: 'Español', value: 'es' },
        { title: 'English', value: 'en' }
    ];

    const themes = [
        { title: 'Claro', value: 'light' },
        { title: 'Oscuro', value: 'dark' }
    ];

    function saveSettings() {
        // Aquí iría la lógica para guardar la configuración (API o localStorage)
        alert('Configuración guardada:\n' + JSON.stringify(settings.value, null, 2));
    }
</script> -->