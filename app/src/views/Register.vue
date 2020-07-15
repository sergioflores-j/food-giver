<template>
  <v-container>
    <user-form
      @submit="submit"
    />
  </v-container>
</template>

<script>
import UserForm from '@/components/UserForm.vue';

export default {
  name: 'Register',
  components: {
    UserForm,
  },
  data() {
    return {};
  },
  methods: {
    submit(user) {
      console.log('user', user);
      // Chamar endp criar user
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
