<template>
  <v-card>
    <v-card-title>
      Minhas necessidades
      <v-spacer />
      <v-btn
        color="primary"
        to="new"
        append
        style="margin: 5px 0;"
      >
        <v-icon>mdi-plus-circle-outline</v-icon>
        Nova necessidade
      </v-btn>
    </v-card-title>

    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
          />
        </v-col>
      </v-row>
    </v-container>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="list"
      :items-per-page="5"
      item-key="necessityId"
      show-select
      :single-select="singleSelect"
      :loading="isLoading.list"
      loading-text="Carregando..."
      no-data-text="Nenhuma necessidade encontrada"
      :search="search"
      class="elevation-1"
    >
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
      Não foi possível obter suas necessidades, tente novamente mais tarde!

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
import { listByUserEmail } from '@/services/necessity';
import { formatDateTime } from '@/utils/formatters';

export default {
  name: 'NecessityListView',
  data() {
    return {
      singleSelect: false,
      selected: [],
      search: '',
      headers: [
        { text: 'Comida', value: 'foodName' },
        { text: 'Quantidade', value: 'quantity' },
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
    this.getNecessityList();
  },
  methods: {
    formatDateTime,
    async getNecessityList() {
      this.list = [];

      if (this.isLoading.list) return;

      this.isLoading.list = true;
      try {
        const { necessities } = await listByUserEmail();
        this.list = necessities;
      } catch (error) {
        this.showErrorSnackbar = true;
      } finally {
        this.isLoading.list = false;
      }
    },
  },
};
</script>
