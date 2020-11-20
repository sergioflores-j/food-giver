<template>
  <div class="d-flex justify-space-between" style="width: 100%;">
    <router-link to="/">
      <v-img
        alt="Logo Food Giver"
        class="shrink mr-2"
        contain
        :src="logo"
        transition="scale-transition"
        width="50"
      />
    </router-link>

    <v-spacer />

    <v-btn v-if="isAuthenticated" icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </div>
</template>

<script>
import logo from '@/assets/logo.jpeg';

export default {
  name: 'Navbar',
  data() {
    return {
      logo,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isLoggedIn'];
    },
  },
  methods: {
    logout() {
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
