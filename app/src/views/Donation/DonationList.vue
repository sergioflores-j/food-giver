<template>
  <v-card>
    <v-card-title>
      Minhas doações
      <v-spacer />
      <v-btn
        class="mt-2"
        color="primary"
        to="new"
        append
      >
        <v-icon>mdi-plus-circle-outline</v-icon>
        Nova doação
      </v-btn>
    </v-card-title>

    <DonationsTable :donations="list" :is-loading="isLoading.list" :selected.sync="selected" />

    <div class="d-flex justify-center" style="padding: 10px;">
      <v-btn v-if="selected.length > 0" color="primary" @click="finishDonations">
        Finalizar
      </v-btn>
    </div>

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
import DonationsTable from '@/components/DonationsTable.vue';

// TODOS: action buttons (finish donation shows dynamically), improve UI (spacings, colors, etc)

export default {
  name: 'DonationListView',
  components: {
    DonationsTable,
  },
  data() {
    return {
      selected: [],
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
    async finishDonations() {
      console.log('this.selected', this.selected);
      // TODO: finish donations
    },
  },
};
</script>
