<template>
  <div class="sidebar-wrapper">
    <v-list>
      <v-list-item class="px-2 align-center justify-center">
        <v-list-item-avatar color="purple" rounded style="margin-left: 10px;">
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
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
      >
        <template v-for="(item, i) in actions">
          <v-list-item
            v-if="checkAccess(item)"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      // TODO:
      selectedItem: 0,
      actions: [
        {
          text: 'My Files',
          icon: 'mdi-folder',
          action: '',
          profile: '',
        },
        {
          text: 'Shared with me',
          icon: 'mdi-account-multiple',
          action: '',
          profile: '',
        },
        {
          text: 'Starred',
          icon: 'mdi-star',
          action: '',
          profile: '',
        },
        {
          text: 'Recent',
          icon: 'mdi-history',
          action: '',
          profile: '',
        },
        {
          text: 'Offline',
          icon: 'mdi-check-circle',
          action: '',
          profile: '',
        },
        {
          text: 'Uploads',
          icon: 'mdi-upload',
          action: '',
          profile: '',
        },
        {
          text: 'Backups',
          icon: 'mdi-cloud-upload',
          action: '',
          profile: '',
        },
      ],
    };
  },
  mounted() {
    this.$store.dispatch('user/getUser', { email: this.$store.state.auth.user.email });
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
  methods: {
    checkAccess({ profile }) {
      console.log('this.user.profile', this.user.profile)
      return this.user.profile === 'all' || this.user.profile === profile;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-wrapper {}
</style>
