<template>
    <v-card class="room-card" :to="`/room/${room.id}`">
        <v-img :src="room.images[0] || '/placeholder-room.jpg'" height="200" cover class="room-image">
            <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-row>
            </template>
        </v-img>

        <v-card-title class="text-truncate">
            {{ room.title }}
        </v-card-title>

        <v-card-text>
            <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-map-marker" class="mr-1"></v-icon>
                <span class="text-truncate">{{ room.address }}</span>
            </div>

            <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-school" class="mr-1"></v-icon>
                <span>{{ room.nearby_university }}</span>
            </div>

            <div class="d-flex align-center">
                <v-icon icon="mdi-currency-eur" class="mr-1"></v-icon>
                <span class="text-h6 font-weight-bold">{{ room.monthly_price }}€/mes</span>
            </div>

            <v-chip-group class="mt-2">
                <v-chip v-for="utility in room.utilities.slice(0, 3)" :key="utility" size="small" color="primary"
                    variant="outlined">
                    {{ utility }}
                </v-chip>
                <v-chip v-if="room.utilities.length > 3" size="small" color="primary" variant="outlined">
                    +{{ room.utilities.length - 3 }}
                </v-chip>
            </v-chip-group>
        </v-card-text>
    </v-card>
</template>

<script setup>
    defineProps({
        room: {
            type: Object,
            required: true
        }
    });
</script>

<style scoped>
    .room-card {
        height: 100%;
        transition: transform 0.2s;
    }

    .room-card:hover {
        transform: translateY(-4px);
    }

    .room-image {
        transition: transform 0.3s;
    }

    .room-card:hover .room-image {
        transform: scale(1.05);
    }
</style>