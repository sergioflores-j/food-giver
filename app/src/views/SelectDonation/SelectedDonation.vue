<template>
  <v-card
    :loading="loading.donation"
  >
    <v-card-title>
      Doação {{ donationId }}
    </v-card-title>

    <v-btn icon to="/select-donation" :disabled="isLoading">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    {{
      donation
    }}

    <v-snackbar v-model="showErrorSnackbar" light>
      Não foi possível buscar os dados da doação, tente novamente mais tarde!

      <template #action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="showErrorSnackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { get } from '@/services/donation';

export default {
  name: 'SelectDonationView',
  props: {
    donationId: { type: String, default: '' },
    userEmail: { type: String, default: '' },
  },
  data() {
    return {
      donation: {},
      user: {},
      showErrorSnackbar: false,
      loading: {
        donation: false,
      },
    };
  },
  computed: {
    isLoading() {
      return Object.values(this.loading).some(i => i);
    },
  },
  mounted() {
    this.getDonation();
  },
  methods: {
    async getDonation() {
      if (this.loading.donation) return;

      this.loading.donation = true;
      try {
        const { donation, user } = await get(this.userEmail, this.donationId);
        this.donation = donation;
        this.user = user;
      } catch (err) {
        console.error('Error getDonation', err);
        this.showErrorSnackbar = true;
      } finally {
        this.loading.donation = false;
      }
    },
  },
};
</script>
