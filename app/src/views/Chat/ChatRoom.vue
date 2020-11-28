<template>
  <v-card
    class="mx-auto"
    max-width="500"
    :loading="loading.chat"
  >
    <v-card-title>
      Chat
    </v-card-title>
    <v-row>
      <v-col align-self="center" class="mx-5 ellipsis" :title="otherParticipantEmail">
        <template v-if="loading.chat">
          Entrando...
        </template>
        <template v-if="!loading.chat">
          <v-avatar :color="chatColor">
            {{ emailInitials }}
          </v-avatar>
          {{ otherParticipantEmail }}
        </template>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showErrorSnackbar"
      light
    >
      Não foi possível obter os dados do chat, tente novamente mais tarde!

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
import qs from 'querystring';
import { get } from '@/services/chat';

export default {
  name: 'ChatView',
  props: {
    chatId: { type: String, default: '' },
  },
  data() {
    return {
      chat: '',
      messages: [],
      websocket: {
        websocket: undefined,
        isDestroying: false,
      },
      eventType: 'test',
      loading: {
        chat: false,
      },
      connectionChecker: '',
      showErrorSnackbar: false,
    };
  },
  computed: {
    sessionUser() {
      return this.$store.getters['auth/user'];
    },
    emailInitials() {
      return this.otherParticipantEmail.substr(0, 1).toUpperCase();
    },
    otherParticipantEmail() {
      if (!this.chat) return '';

      if (this.chat.participant1 === this.sessionUser.email) return this.chat.participant2;
      return this.chat.participant1;
    },
    socketArgs() {
      return qs.stringify({
        chatId: this.chatId,
        userEmail: this.sessionUser.email,
      });
    },
    chatColor() {
      if (!this.chat || !this.chat.activeSocket) return 'grey';

      return this.chat.activeSocket[this.otherParticipantEmail] ? 'green' : 'grey';
    },
  },
  async mounted() {
    console.log('chatId :>> ', this.chatId);
    await this.getChatInfo();
    await this.connect();
  },
  beforeDestroy() {
    this.websocket.isDestroying = true;
    this.disconnect();
  },
  destroyed() {
    clearTimeout(this.connectionChecker);
  },
  methods: {
    async getChatInfo() {
      if (this.loading.chat) return;

      this.loading.chat = true;
      try {
        this.chat = await get(this.chatId);
      } catch (err) {
        this.showErrorSnackbar = true;
      } finally {
        this.loading.chat = false;
      }
    },
    socketEventHandler(event, result) {
      switch (event) {
        case 'newMessage':
          break;
        case 'connected':
          this.$set(this.chat.activeSocket, this.otherParticipantEmail, {});
          break;
        case 'disconnected':
          this.$delete(this.chat.activeSocket, this.otherParticipantEmail);
          break;
        default:
          console.log('Unexpected Event');
      }
    },
    connect() {
      console.log('Connecting...');
      /*
       * See https://html.spec.whatwg.org/multipage/indices.html#events-2
       * for details around each WebSocket event type.
       */
      this.websocket.client = new WebSocket(`${process.env.VUE_APP_CHAT_WS_ENDPOINT}?${this.socketArgs}`);

      this.checkSocketConnection();

      // util para reabrir a connection caso tenha sido fechada por inatividade
      this.websocket.client.onclose = ({ wasClean, code, reason }) => {
        console.log(
          `onclose: ${JSON.stringify({ wasClean, code, reason })}`,
        );
        clearTimeout(this.connectionChecker);

        // ? se perdeu a conexão e não foi pq saiu do componente, tenta se reconectar
        if (
          !this.websocket.isDestroying
          && (
            !wasClean // interrupção na internet, queda, etc
            || code === 1001 // timeout final (2h) deve reconectar...
          )
        ) {
          setTimeout(() => {
            this.connect();
          }, 2000);
        }
      };

      this.websocket.client.onerror = error => {
        console.error('Socket error:', error);
        console.log(
          'onerror: An error has occurred. See console for details.',
        );
        clearTimeout(this.connectionChecker);
      };

      this.websocket.client.onmessage = ({ data }) => {
        console.log(`onmessage: ${data}`);
        const { event, ...result } = typeof data === 'string' ? JSON.parse(data) : data;

        this.socketEventHandler(event, result);
      };

      this.websocket.client.onopen = () => {
        console.log('onopen: Connected successfully.');
      };
    },
    checkSocketConnection() {
      clearTimeout(this.connectionChecker);
      this.connectionChecker = setTimeout(() => {
        console.log('checkingSocketConnection');
        this.send({ data: 'ping' });
        this.checkSocketConnection();
      }, 5000 * 60); // 5 min
    },
    send({ route = '$default', data = '' } = {}) {
      console.log('client: Sending a message.');
      this.websocket.client.send(JSON.stringify({ action: route, data }));
    },
    disconnect() {
      console.log('client: Closing the connection.');
      this.websocket.client.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
