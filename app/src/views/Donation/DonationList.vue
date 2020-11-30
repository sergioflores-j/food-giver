<template>
  <v-card>
    <v-card-title>
      Minhas doações
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
      />
      <v-spacer />
      <v-btn class="mt-2" color="primary" to="/donations/new">
        <v-icon>mdi-plus-circle-outline</v-icon>
        Nova doação
      </v-btn>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="list"
      :items-per-page="5"
      item-key="donationId"
      show-select
      :single-select="singleSelect"
      :loading="isLoading.list"
      loading-text="Carregando..."
      :search="search"
      class="elevation-1"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.expiresAt="{ item, value }">
        <!-- <v-chip
          v-if="item.expiresAt"
          :color="getConditionColor(value)"
          dark
          class="d-none d-sm-flex flex-row"
        >
          {{ getConditionLabel(value) }}
        </v-chip> -->
        <v-chip v-if="value" :color="getConditionColor(item.condition)" dark>
          {{ formatDateTime(value) }}
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
    <v-snackbar v-model="showErrorSnackbar" light>
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
  </v-card>
</template>

<script>
import { listByUserEmail } from '@/services/donation';
import { formatDateTime } from '@/utils/formatters';
import { conditions } from '@/constants/donation';

// TODOS: action buttons (finish donation shows dynamically), improve UI (spacings, colors, etc)

export default {
  name: 'DonationListView',
  data() {
    return {
      singleSelect: false,
      selected: [],
      search: '',
      headers: [
        { text: 'Comida', value: 'foodName' },
        { text: 'Validade', value: 'expiresAt' },
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
    getConditionLabel(condition) {
      return conditions[condition].label || '';
    },
    getConditionColor(condition) {
      return conditions[condition].color || '';
    },
  },
};
</script>
