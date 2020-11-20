<template>
  <nav class="d-flex align-center">
    <router-link to="/">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        :src="logo"
        transition="scale-transition"
        width="50"
      />
    </router-link>
    <v-spacer />
  </nav>
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
};
</script>

<style lang="scss" scoped>

</style>
