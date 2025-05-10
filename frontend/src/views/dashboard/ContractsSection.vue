<template>
    <div>
        <h2 class="text-h5 font-weight-bold mb-4">Mis contratos</h2>

        <h3 class="text-h6 mb-2">Pendientes de firma</h3>
        <v-alert v-if="pendingContracts.length === 0" type="info" border="start" class="mb-4">
            No tienes contratos pendientes de firma.
        </v-alert>
        <v-table v-else>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Reserva</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="contract in pendingContracts" :key="contract.id">
                    <td>{{ contract.contract_name }}</td>
                    <td>{{ contract.booking_id }}</td>
                    <td>{{ formatDate(contract.created_at) }}</td>
                    <td>
                        <v-btn color="primary" variant="outlined" :href="contract.pdf_file" target="_blank">
                            <v-icon start>mdi-download</v-icon>
                            Descargar
                        </v-btn>
                        <!-- Aquí podrías poner un botón para firmar -->
                    </td>
                </tr>
            </tbody>
        </v-table>

        <h3 class="text-h6 mt-6 mb-2">Contratos firmados</h3>
        <v-alert v-if="signedContracts.length === 0" type="info" border="start" class="mb-4">
            No tienes contratos firmados.
        </v-alert>
        <v-table v-else>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Reserva</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="contract in signedContracts" :key="contract.id">
                    <td>{{ contract.contract_name }}</td>
                    <td>{{ contract.booking_id }}</td>
                    <td>{{ formatDate(contract.created_at) }}</td>
                    <td>
                        <v-btn color="primary" variant="outlined" :href="contract.pdf_file" target="_blank">
                            <v-icon start>mdi-download</v-icon>
                            Descargar
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-progress-linear v-if="contractsStore.loading" indeterminate color="primary" class="mt-4" />
        <v-alert v-if="contractsStore.error" type="error" class="mt-4">
            {{ contractsStore.error }}
        </v-alert>
    </div>
</template>

<script setup>
    import { onMounted, computed } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { useContractsStore } from '@/store/contracts';

    const authStore = useAuthStore();
    const contractsStore = useContractsStore();

    onMounted(() => {
        if (authStore.token) {
            contractsStore.fetchContracts(authStore.token);
        }
    });

    const pendingContracts = computed(() =>
        contractsStore.contracts.filter(c => !c.is_signed)
    );
    const signedContracts = computed(() =>
        contractsStore.contracts.filter(c => c.is_signed)
    );

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    }
</script>