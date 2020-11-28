<template>
  <v-list>
    <v-list-item to="/profile" class="px-2">
      <v-list-item-avatar
        color="purple"
        rounded
        left
        :min-height="50"
      >
        {{ userNameInitials }}
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-if="user.name" class="title">
          {{ user.name }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list
      nav
      dense
    >
      <template v-for="(item, i) in actions">
        <v-list-item
          v-if="checkAccess(item)"
          :key="i"
          :to="item.action"
          active-class="primary--text"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.text" />
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-list>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      // TODO: pegar a partir das routes definidas no router, colocar todas as infos no meta :D
      actions: [
        {
          text: 'Doações',
          icon: 'mdi-food-drumstick',
          action: '/donations',
          profile: 'giver',
        },
        {
          text: 'Necessidades',
          icon: 'mdi-food-drumstick-outline',
          action: '',
          profile: '',
        },
        {
          text: 'Chats',
          icon: 'mdi-chat',
          action: '/chats',
          profile: 'all',
        },
        {
          text: 'Seleção de Doação',
          icon: 'mdi-cursor-default-click',
          action: '/select-donation',
          profile: '',
        },
      ],
    };
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
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
  mounted() {
    this.$store.dispatch('user/getUser', { email: this.$store.state.auth.user.email });
  },
  methods: {
    checkAccess({ profile }) {
      return this.user.profile === 'all' || this.user.profile === profile;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-wrapper {}
</style>
