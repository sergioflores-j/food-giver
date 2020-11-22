<template>
  <div class="profile">
    <h1>This is an profile page</h1>
    <pre><code>{{ user }}</code></pre>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {

    };
  },
  mounted() {
    this.$store.dispatch('user/getUser', { email: this.$store.state.auth.user.email });
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
