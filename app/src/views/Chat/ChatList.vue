<template>
  <v-card
    class="mx-auto"
    max-width="500"
    :loading="loading.list"
  >
    <v-card-title>
      Meus chats
    </v-card-title>

    <v-list subheader>
      <v-list-item
        v-for="chat in list"
        :key="chat.chatId"
        :to="`/chats/${chat.chatId}`"
      >
        <v-list-item-avatar
          :color="getRandomColor()"
          rounded
          left
        >
          {{ getEmailInitials(chat) }}
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="getOtherParticipantEmail(chat)" />
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon :color="'grey'">
            mdi-message-outline
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <v-snackbar
      v-model="showErrorSnackbar"
      light
    >
      Não foi possível obter seus chats, tente novamente mais tarde!

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
import { listByUserEmail } from '@/services/chat';
import colors from 'vuetify/lib/util/colors';

export default {
  name: 'ChatListView',
  data() {
    return {
      list: [],
      loading: {
        list: false,
      },
      showErrorSnackbar: false,
    };
  },
  computed: {
    sessionUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    this.getChatList();
  },
  methods: {
    getRandomColor() {
      const colorsKeys = Object.keys(colors);
      const [firstKey] = colorsKeys.sort(() => 0.5 - Math.random());

      return colors[firstKey].base;
    },
    getEmailInitials({ participant1, participant2 } = {}) {
      return this.getOtherParticipantEmail({ participant1, participant2 }).substr(0, 1).toUpperCase();
    },
    getOtherParticipantEmail({ participant1, participant2 } = {}) {
      if (participant1 === this.sessionUser.email) return participant2;
      return participant1;
    },
    async getChatList() {
      this.list = [];

      if (this.loading.list) return;

      this.loading.list = true;
      try {
        const { chats } = await listByUserEmail();
        this.list = chats;
      } catch (error) {
        this.showErrorSnackbar = true;
      } finally {
        this.loading.list = false;
      }
    },
  },
};
</script>
