<template>
  <v-app>
    <v-navigation-drawer
      v-if="isAuthenticated"
      app
      permanent
      expand-on-hover
    >
      <v-list>
        <v-list-item class="px-2 align-center justify-center">
          <v-list-item-avatar color="purple" rounded>
            {{ userNameInitials }}
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link to="/profile">
          <v-list-item-content>
            <v-list-item-title v-if="user.name" class="title">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list
        nav
        dense
      >
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>My Files</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Shared with me</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Starred</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      elevate-on-scroll
      light
      show-drawer
    >
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
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isLoggedIn'];
    },
    user() {
      return this.$store.getters['auth/user'];
    },
    userNameInitials() {
      if (!this.user.name) return 'FG';

      const nameSplit = this.user.name.split(' ');

      return `${
        nameSplit[0].substr(0, 1)
      }${
        nameSplit.length > 1 && nameSplit[nameSplit.length - 1].substr(0, 1)
      }`;
    },
  },
};
</script>
