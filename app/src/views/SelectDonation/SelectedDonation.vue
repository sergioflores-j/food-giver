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
              <v-list-item v-if="!necessities.length" disabled>
                Nenhuma necessidade encontrada.
              </v-list-item>
              <v-list-item v-for="(necessity, index) of necessities" :key="index" :value="index">
                <template #default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active" />
                  </v-list-item-action>

                  <v-list-item-content>
                    <template v-if="!necessity.donations">
                      <v-list-item-title>
                        {{ necessity.foodName }} - {{ necessity.quantity }}
                      </v-list-item-title>
                    </template>

                    <template v-if="necessity.donations">
                      <v-list-group>
                        <template #activator>
                          <v-list-item-title>
                            {{ necessity.foodName }} - {{ necessity.quantity }}
                          </v-list-item-title>
                        </template>
                        <v-list-item-content>Já atendida por:</v-list-item-content>

                        <v-list dense>
                          <v-list-item v-for="(d, dIndex) of necessity.donations" :key="`${d.donationId}-${dIndex}`" disabled>
                            {{ d.donationId }} - {{ d.userEmail }}
                          </v-list-item>
                        </v-list>
                      </v-list-group>
                    </template>
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
          Selecionar
        </v-btn>
      </div>
    </template>

    <v-snackbar v-model="snackbar.show" :color="snackbar.type" outlined>
      {{ snackbar.text }}

      <template #action="{ attrs }">
        <v-btn
          :color="snackbar.type"
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { get } from '@/services/donation';
import { create as createChat, createMessage as createChatMessage } from '@/services/chat';
import { listByUserEmail as listNecessitiesByUser, selectDonation } from '@/services/necessity';
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
      selectedNecessity: -1,
      necessities: [],
      snackbar: {
        show: false,
        text: '',
        type: '',
      },
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
    sessionUser() {
      return this.$store.getters['auth/user'];
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
        this.openSnackbar('Não foi possível buscar os dados da doação, tente novamente mais tarde!');
      } finally {
        this.loading.donation = false;
      }
    },
    async getNecessityList() {
      if (this.loading.necessities) return;

      this.loading.necessities = true;
      try {
        const { necessities } = await listNecessitiesByUser({ showFinished: false });
        this.necessities = necessities;
      } catch (err) {
        console.error('error getNecessityList', err);
        // TODO: mostrar erros customizados na snackbar :D
        this.openSnackbar('Não foi possível buscar as suas necessidades, tente novamente mais tarde!');
      } finally {
        this.loading.necessities = false;
      }
    },
    async selectDonation() {
      if ((!this.selectedNecessity && this.selectedNecessity === 0) || this.selectedNecessity < 0) {
        this.openSnackbar('Selecione uma necessidade a ser atendida', { type: 'warning' });
        return;
      }

      const selectedNecessity = this.necessities[this.selectedNecessity];

      this.loading.submit = true;

      try {
        await selectDonation(selectedNecessity.necessityId, {
          userEmail: this.userEmail,
          donationId: this.donationId,
        });

        await this.startChat();
      } catch (error) {
        this.openSnackbar('Não foi possível selecionar a doação, tente novamente mais tarde!');
      } finally {
        this.loading.submit = false;
      }
    },
    async startChat() {
      const { chat } = await createChat({
        participant1: this.sessionUser.email,
        participant2: this.userEmail,
      });

      await createChatMessage(chat.chatId, {
        from: this.sessionUser.email,
        to: this.user,
        message: `Olá, estou entrando em contato sobre a doação de ${this.donation.foodName}`,
      });

      this.$router.push(`/chats/${chat.chatId}`);
    },
    openSnackbar(text, { type = 'error' } = {}) {
      this.snackbar.show = true;
      this.snackbar.text = text;
      this.snackbar.type = type;
    },
  },
};
</script>

<style lang="scss" scoped>
.selected-donation-container {

}
</style>
