<template>
  <v-container class="home">
    Autenticação realizada com sucesso!
    <!-- TODO: dashboard -->
  </v-container>
</template>

<script>
export default {
  name: 'HomeView',
  mounted() {
    this.$router.push('/chats');
  },
};
</script>
