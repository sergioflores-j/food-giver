<template>
  <v-card
    class="mx-auto selected-donation-container"
    :loading="loading.donation"
    max-width="700"
  >
    <v-card-title>
      <v-btn icon to="/select-donation" :disabled="isLoading">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span style="margin-left: 15px;">Seleção da Doação</span>
    </v-card-title>

    <v-overlay :value="isLoading" absolute>
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>

    <!-- USER SECTION -->
    <template v-if="donation && user">
      <DonationDetail :user="user" :donation="donation" />

      <v-divider />

      <!-- NECESSITY SECTION -->
      <h4 class="mx-5 mt-3">
        Necessidade a ser atendida
      </h4>
      <v-row class="ml-5 mr-3">
        <v-col>
          <div
            v-if="loading.necessities"
          >
            Carregando...
          </div>

          <v-list v-if="!loading.necessities">
            <v-list-item-group v-model="selectedNecessity" color="primary">
              <v-list-item v-for="(necessity, index) of necessities" :key="index">
                <template #default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active" />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ necessity.foodName }} - {{ necessity.quantity }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>

      <!-- ACTIONS SECTION -->
      <div class="d-flex justify-center" style="padding: 15px;">
        <v-btn
          color="primary"
          :disabled="!selectedNecessity && selectedNecessity !== 0"
          :loading="loading.submit"
          @click="selectDonation"
        >
          Finalizar
        </v-btn>
      </div>
    </template>

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
import { listByUserEmail as listNecessitiesByUser } from '@/services/necessity';
import DonationDetail from '@/components/DonationDetail.vue';

export default {
  name: 'SelectDonationView',
  components: {
    DonationDetail,
  },
  props: {
    donationId: { type: String, default: '' },
    userEmail: { type: String, default: '' },
  },
  data() {
    return {
      donation: '',
      user: '',
      showErrorSnackbar: false,
      selectedNecessity: 0,
      necessities: [],
      loading: {
        donation: false,
        necessities: false,
        submit: false,
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
    this.getNecessityList();
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
    async getNecessityList() {
      if (this.loading.necessities) return;

      this.loading.necessities = true;
      try {
        const { necessities } = await listNecessitiesByUser();
        this.necessities = necessities;
      } catch (err) {
        console.error('error getNecessityList', err);
        // TODO: mostrar erros customizados na snackbar :D
        this.showErrorSnackbar = true;
      } finally {
        this.loading.necessities = false;
      }
    },
    async selectDonation() {
      console.log('this.selectedNecessity', this.selectedNecessity);
      this.loading.submit = true;
      // TODO: redirect pro chat
      this.$router.push('/select-donation');
    },
  },
};
</script>

<style lang="scss" scoped>
.selected-donation-container {

}
</style>
