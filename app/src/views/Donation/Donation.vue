<template>
  <v-container>
    <h1>Minhas doações</h1>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="list"
      :items-per-page="5"
      locale="pt-BR"
      item-key="donationId"
      show-select
      :single-select="singleSelect"
      :loading="isLoading.list"
      loading-text="Carregando..."
      class="elevation-1"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.condition="{ item, value }">
        <v-chip
          v-if="item.expiresAt"
          :color="getConditionColor(value)"
          dark
        >
          {{ getCondition(value) }}
        </v-chip>
        <v-chip
          v-if="item.expiresAt"
          color="grey"
          dark
        >
          {{ formatDateTime(item.expiresAt) }}
        </v-chip>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.createdAt="{ value }">
        {{ formatDateTime(value) }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.updatedAt="{ value }">
        {{ formatDateTime(value) }}
      </template>
    </v-data-table>
    <v-snackbar
      v-model="showErrorSnackbar"
      light
    >
      Não foi possível obter suas doações, tente novamente mais tarde!

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
  </v-container>
</template>

<script>
import { listByUserEmail } from '@/services/donation';
import { formatDateTime } from '@/utils/formatters';

// TODOS: action buttons (finish donation shows dynamically), improve UI (spacings, colors, etc)

export default {
  name: 'DonationView',
  data() {
    return {
      singleSelect: false,
      selected: [],
      headers: [
        { text: 'Comida', value: 'foodName' },
        { text: 'Condição', value: 'condition' },
        { text: 'Criação', value: 'createdAt' },
        { text: 'Última Atualização', value: 'updatedAt' },
      ],
      list: [],
      isLoading: {
        list: false,
      },
      showErrorSnackbar: false,
    };
  },
  mounted() {
    this.getDonationList();
  },
  methods: {
    formatDateTime,
    async getDonationList() {
      this.list = [];

      if (this.isLoading.list) return;

      this.isLoading.list = true;
      try {
        const { donations } = await listByUserEmail();
        this.list = donations;
      } catch (error) {
        this.showErrorSnackbar = true;
      } finally {
        this.isLoading.list = false;
      }
    },
    getCondition(condition) {
      // TODO: constants file
      const conditions = {
        new: 'Bem conservado',
        almost_due: 'Próprio para consumo em curto tempo',
        rotten: 'Próprio para utilização como dejeto',
      };

      return conditions[condition] || '';
    },
    getConditionColor(condition) {
      const conditions = {
        new: 'green',
        almost_due: 'yellow',
        rotten: 'brown',
      };

      return conditions[condition] || '';
    },
  },
};
</script>
