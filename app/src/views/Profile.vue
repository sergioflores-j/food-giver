<template>
  <v-container class="profile-container" fluid>
    <v-card>
      <v-card-title>Perfil</v-card-title>

      <v-overlay :value="!Object.keys(user).length" absolute>
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>

      <v-row class="ml-5 mr-2">
        <v-col cols="3" class="d-flex justify-center align-center">
          <v-avatar size="66">
            <v-icon :size="66">
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </v-col>

        <v-col v-if="Object.keys(user).length" cols="8">
          <div>
            {{ user.name }}
          </div>
          <div style="margin-top: 5px;">
            <strong>Endereço:</strong> {{ userCompleteAddress }}
          </div>
          <div style="margin-top: 5px;">
            <strong>Telefone:</strong> {{ formatPhone(user.phone) }}
          </div>
          <div style="margin-top: 5px;">
            <strong>Criado em:</strong> {{ formatDateTime(user.createdAt) }}
          </div>
          <div style="margin-top: 5px;">
            <strong>Atualizado em:</strong> {{ formatDateTime(user.updatedAt) }}
          </div>
          <div style="margin-top: 5px;">
            <strong>Perfil Food Giver:</strong> {{ profiles[user.profile].label }}
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { formatPhone, formatCep, formatDateTime } from '@/utils/formatters';
import profiles from '@/constants/profiles';
// TODO: edit profile ;D
export default {
  name: 'Profile',
  data() {
    return {
      profiles,
    };
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
    },
    // TODO: centralize this method, it's also in DonationDetail
    userCompleteAddress() {
      if (!this.user || !this.user.address) return '';
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
  mounted() {
    this.$store.dispatch('user/getUser', { email: this.$store.state.auth.user.email });
  },
  methods: {
    formatPhone,
    formatDateTime,
  },
};
</script>

<style lang="scss" scoped>

</style>
