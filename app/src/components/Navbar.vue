<template>
  <div class="d-flex justify-space-between" style="width: 100%;">
    <v-app-bar-nav-icon v-if="showCollapseToggle" @click.stop="() => drawer = !drawer" />

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
  props: {
    value: { type: Boolean, default: true },
    showCollapseToggle: { type: Boolean, default: true },
  },
  data() {
    return {
      logo,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isLoggedIn'];
    },
    drawer: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
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
