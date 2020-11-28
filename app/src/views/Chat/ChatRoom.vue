<template>
  <div class="chat">
    <v-btn @click="connect">Connect</v-btn>
    <v-btn @click="send">Send</v-btn>
    <v-btn @click="disconnect">Disconnect</v-btn>
    <pre>{{ messages.join('\n') }}</pre>
  </div>
</template>

<script>
import qs from 'querystring';

export default {
  name: 'ChatView',
  data() {
    return {
      messages: [],
      websocket: undefined,
      socketArgs: qs.stringify({
        participant1: this.$store.state.auth.user.email,
        participant2: this.$store.state.auth.user.email.includes('carolina') ? 'sergio.flores@univille.edu.br' : 'carolina.trindade@univille.edu.br',
      }),
      eventType: 'test',
    };
  },
  methods: {
    connect() {
      /*
       * See https://html.spec.whatwg.org/multipage/indices.html#events-2
       * for details around each WebSocket event type.
       */
      // WebSocket sends a message to API Gateway on creation that gets
      // routed to the '$connect' route
      this.websocket = new WebSocket(`ws://localhost:4000/?${this.socketArgs}`);
      console.log('this.websocket', this.websocket);
      // util para reabrir a connection caso tenha sido fechada por inatividade
      this.websocket.onclose = ({ wasClean, code, reason }) => {
        this.messages.push(
          `onclose: ${JSON.stringify({ wasClean, code, reason })}`,
        );
      };
      this.websocket.onerror = error => {
        console.log(error);
        this.messages.push(
          'onerror: An error has occurred. See console for details.',
        );
      };
      this.websocket.onmessage = ({ data }) => {
        this.messages.push(`onmessage: ${data}`);
      };
      this.websocket.onopen = () => {
        this.messages.push('onopen: Connected successfully.');
      };
    },
    send() {
      this.messages.push('client: Sending a message.');
      this.websocket.send(
        // This message will be routed to 'routeA' based on the 'action' property
        JSON.stringify({ action: 'routeA', data: 'Hello from client.' }),
      );
    },
    disconnect() {
      // WebSocket sends a $disconnect message to the server on page reload or close, so you do not have to close the connection yourself in those scenarios
      // WebSocket sends a message to API Gateway that gets routed to the '$disconnect' route.
      this.messages.push('client: Closing the connection.');
      this.websocket.close();
    },
  },
};
</script>
