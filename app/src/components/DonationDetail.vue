<template>
  <v-container fluid>
    <h4 class="mx-5">
      Identificação do Usuário
    </h4>
    <v-row class="ml-5 mr-2">
      <v-col cols="3" class="d-flex justify-center align-center">
        <v-avatar size="66">
          <v-icon :size="66">
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-col>
      <v-col cols="8">
        <div>
          {{ user.name }}
        </div>
        <div style="margin-top: 5px;">
          <strong>Endereço:</strong> {{ userCompleteAddress }}
        </div>
        <div style="margin-top: 5px;">
          <strong>Telefone:</strong> {{ formatPhone(user.phone) }}
        </div>
      </v-col>
    </v-row>

    <v-divider />

    <!-- DONATION SECTION -->
    <h4 class="mx-5 mt-3">
      Doação
    </h4>
    <v-row class="ml-5 mr-3">
      <v-col>
        {{ donation.foodName }}
        <div style="margin-top: 5px;">
          <strong>Condição:</strong> {{ conditions[donation.condition].label }}
        </div>
        <div v-if="donation.expiresAt" style="margin-top: 5px;">
          <strong>Valido até:</strong> {{ formatDateTime(donation.expiresAt) }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { formatPhone, formatCep, formatDateTime } from '@/utils/formatters';
import { conditions } from '@/constants/donation';

export default {
  name: 'DonationDetail',
  props: {
    donation: { type: Object, default: () => ({}) },
    user: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      conditions,
    };
  },
  computed: {
    userCompleteAddress() {
      if (!this.user) return '';
      const { address } = this.user;

      return `
        ${address.street},
        ${address.number},
        ${address.complement ? `${address.complement},` : ''}
        ${address.neighborhood},
        ${address.city} -
        ${address.state},
        ${address.zipCode ? `${formatCep(address.zipCode)}` : ''}
      `;
    },
  },
  methods: {
    formatPhone,
    formatDateTime,
  },
};
</script>

<style>

</style>
