<template>
  <v-app>
    <v-navigation-drawer app>
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar
      app
      elevate-on-scroll
      light
      show-drawer
    >
      <div class="d-flex align-center">
        <router-link to="/">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            :src="require('./assets/logo.jpeg')"
            transition="scale-transition"
            width="50"
          />
        </router-link>
        <v-spacer />
      </div>

      <v-spacer />

      <Navbar />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <!-- If using vue-router -->
        <transition name="slide-x-reverse-transition" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </v-container>
    </v-main>

    <v-footer
      dark
      padless
    >
      <v-card
        flat
        tile
        class="primary white--text text-center"
        min-width="100%"
      >
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }}
          — <strong>UNIVILLE</strong>
          — Universidade da Região de Joinville (Sergio e Carolina)
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data: () => ({
    //
  }),
};
</script>
