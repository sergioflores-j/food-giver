<template>
  <v-container fluid class="chat-wrapper">
    <div ref="chatContainer" class="chat-container">
      <v-overlay :value="isLoading" absolute>
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>

      <v-overlay :value="!messages.length" absolute>
        Nenhuma mensagem, envie para começar o chat.
      </v-overlay>

      <transition-group tag="div" name="fade-transition">
        <template
          v-for="(message, index) of messages"
        >
          <div
            :key="index"
            class="message"
            :class="{ own: message.from === userEmail, loading: !message.messageId }"
          >
            <div class="content" style="margin-top: 5px">
              <!-- TODO: sanitize message content -->
              <div v-html="message.message" />
              <div v-if="message.createdAt" class="date">
                {{ formatDateTime(message.createdAt) }}
              </div>
              <div v-if="!message.messageId" class="loading">
                <v-progress-circular
                  indeterminate
                  size="12"
                />
                Enviando...
              </div>
            </div>
          </div>
        </template>
      </transition-group>
    </div>

    <div class="new-message-container">
      <v-text-field
        v-model="newMessage"
        type="text"
        label="Escreva sua mensagem..."
        :append-outer-icon-disabled="!newMessage"
        clearable
        :loading="loading.newMessage"
        :disabled="isLoading"
        @keyup.enter="sendMessage"
      >
        <template #append-outer>
          <v-btn
            :color="newMessage && 'primary'"
            icon
            :disabled="isLoading || !newMessage"
            @click="sendMessage"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>
  </v-container>
</template>

<script>
import { formatDateTime } from '@/utils/formatters';

export default {
  props: {
    chat: { type: Object, default: () => ({}) },
    messages: { type: Array, default: () => ([]) },
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      newMessage: '',
      loading: {
        newMessage: false,
      },
    };
  },
  computed: {
    sessionUser() {
      return this.$store.getters['auth/user'];
    },
    userEmail() {
      return this.sessionUser.email;
    },
  },
  watch: {
    messages() {
      this.scrollToEnd();
    },
  },
  methods: {
    formatDateTime,
    sendMessage() {
      if (!this.newMessage) return;
      this.$emit('new-message', this.newMessage);

      this.newMessage = '';
    },
    scrollToEnd() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-wrapper {
  padding: 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .chat-container {
    box-sizing: border-box;
    min-height: 50vh;
    max-height: calc(100vh - 320px);
    overflow-y: auto;
    padding: 10px;
    background-color: #f2f2f2;
    position: relative;

    .message {
      margin-bottom: 3px;
      &.loading {
        color: #a3a3a3;
        .content {
          background-color: #4b4b4b !important;
        }
      }

      &.own {
        text-align: right;
        .content {
          background-color: #33691E;
          color: white;
        }
      }
      .date {
        font-size: 60%;
        text-align: right;
        margin-top: 5px;
      }
      .loading {
        font-size: 60%;
        text-align: right;
        margin-top: 5px;
      }
    }

    .content {
      padding: 8px;
      background-color: #537753;
      color: white;
      border-radius: 10px;
      display: inline-block;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
        0 2px 1px -1px rgba(0, 0, 0, 0.12);
      max-width: 50%;
      word-wrap: break-word;
    }

    @media (max-width: 480px) {
      .content {
        max-width: 60%;
      }
    }
  }

  .new-message-container {
    bottom: 0;
    width: 100%;
    padding: 5px 8px;
  }
}

</style>
