<template>
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
      <v-spacer />
    </v-row>

    <v-data-table
      v-model="internalSelected"
      :headers="headers"
      :items="donations"
      :items-per-page="5"
      :item-class="itemClass"
      item-key="donationId"
      show-select
      :single-select="singleSelect"
      :loading="isLoading"
      loading-text="Carregando..."
      :search="search"
      v-on="$listeners"
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
  </v-container>
</template>

<script>
import { conditions } from '@/constants/donation';
import { formatDateTime } from '@/utils/formatters';

export default {
  name: 'DonationsTable',
  props: {
    donations: { type: Array, default: () => [] },
    selected: { type: [Array, Object], default: () => [] },
    isLoading: { type: Boolean, default: false },
    singleSelect: { type: Boolean, default: false },
    itemClass: { type: [String, Function], default: () => () => '' },
  },
  data() {
    return {
      // selected: [],
      search: '',
      headers: [
        { text: 'Comida', value: 'foodName' },
        { text: 'Validade', value: 'expiresAt' },
        { text: 'Criação', value: 'createdAt' },
        { text: 'Última Atualização', value: 'updatedAt' },
      ],
    };
  },
  computed: {
    internalSelected: {
      get() {
        return this.selected;
      },
      set(val) {
        this.$emit('update:selected', val);
      },
    },
  },
  methods: {
    formatDateTime,
    getConditionLabel(condition) {
      return conditions[condition].label || '';
    },
    getConditionColor(condition) {
      return conditions[condition].color || '';
    },
  },
};
</script>

<style>
</style>
