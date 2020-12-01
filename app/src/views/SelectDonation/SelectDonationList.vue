<template>
  <v-card>
    <v-card-title>
      Selecionar doação
    </v-card-title>

    <DonationsTable
      :donations="list"
      :is-loading="loading.list"
      single-select
      :selected.sync="selected"
      :item-class="() => 'cursor-pointer'"
      @click:row="openDetail"
    />

    <v-snackbar v-model="showErrorSnackbar" light>
      Não foi possível a lista de doações, tente novamente mais tarde!

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
import { list } from '@/services/donation';
import DonationsTable from '@/components/DonationsTable.vue';

export default {
  name: 'SelectDonationListView',
  components: {
    DonationsTable,
  },
  data() {
    return {
      selected: [],
      list: [],
      loading: {
        list: false,
      },
      showErrorSnackbar: false,
    };
  },
  watch: {
    selected() {
      this.openDetail(this.selected[0]);
    },
  },
  mounted() {
    this.getDonationList();
  },
  methods: {
    async getDonationList() {
      this.list = [];

      if (this.loading.list) return;

      this.loading.list = true;
      try {
        const { donations } = await list();
        this.list = donations;
      } catch (err) {
        console.error('Error getDonationList', err);
        this.showErrorSnackbar = true;
      } finally {
        this.loading.list = false;
      }
    },
    async openDetail(selected) {
      this.$router.push({
        path: `/select-donation/${selected.userEmail}/${selected.donationId}`,
      });
    },
  },
};
</script>
