<template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-4">Mis pagos</h2>

        <v-alert v-if="paymentsStore.payments.length === 0 && !paymentsStore.loading" type="info" border="start"
            class="mb-4">
            No tienes pagos registrados.
        </v-alert>

        <v-table v-else>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Reserva</th>
                    <th>Método</th>
                    <th>Importe</th>
                    <th>Estado</th>
                    <th>Fecha de pago</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in paymentsStore.payments" :key="p.id">
                    <td>{{ p.payment_title }}</td>
                    <td>{{ p.booking_id }}</td>
                    <td>{{ p.payment_method }}</td>
                    <td>{{ p.amount }} €</td>
                    <td>
                        <v-chip :color="p.status === 'paid' ? 'success' : 'warning'" size="small">
                            {{ p.status === 'paid' ? 'Pagado' : p.status }}
                        </v-chip>
                    </td>
                    <td>
                        {{ p.paid_at ? formatDate(p.paid_at) : 'Pendiente' }}
                    </td>
                    <td>
                        <v-btn v-if="p.status !== 'paid'" color="primary" variant="outlined" @click="payNow(p)">
                            <v-icon start>mdi-credit-card</v-icon>
                            Pagar
                        </v-btn>
                        <v-btn v-else color="success" variant="outlined" :href="p.stripe_session_id" target="_blank">
                            <v-icon start>mdi-receipt</v-icon>
                            Ticket
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-progress-linear v-if="paymentsStore.loading" indeterminate color="primary" class="mt-4" />
        <v-alert v-if="paymentsStore.error" type="error" class="mt-4">
            {{ paymentsStore.error }}
        </v-alert>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { usePaymentsStore } from '@/store/payments';

    const authStore = useAuthStore();
    const paymentsStore = usePaymentsStore();

    onMounted(() => {
        if (authStore.token) {
            paymentsStore.fetchPayments(authStore.token);
        }
    });

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    }

    function payNow(payment) {
        // Aquí iría la lógica para redirigir al checkout de Stripe o mostrar un modal
        alert('Aquí iría la lógica de pago para el pago con id: ' + payment.id);
    }

    function getStripeReceiptUrl(sessionId) {
        // Si guardas la URL del recibo en Stripe, puedes devolverla aquí.
        // Si solo tienes el session_id, puedes construir la URL de Stripe Dashboard (solo para admins)
        // Para usuarios, normalmente guardarías la URL del recibo en la base de datos.
        if (!sessionId) return '#';
        return `https://dashboard.stripe.com/payments/${sessionId}`;
    }
</script>