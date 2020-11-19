<template>
  <v-container>
    <user-form
      :loading="loading"
      :errors="errors"
      @submit="submit"
    />
  </v-container>
</template>

<script>
import UserForm from '@/components/UserForm.vue';
import UserService from '@/services/UserService';

export default {
  name: 'Register',
  components: {
    UserForm,
  },
  data() {
    return {
      loading: false,
      errors: [],
    };
  },
  methods: {
    async submit(user) {
      this.loading = true;

      try {
        await UserService.create(user);

        // TODO: Notificar que criou o usuário
        // TODO: realizar login

        // ? Envia para a página inicial
        this.$router.push('/');
      } catch (err) {
        if (err.response?.data?.error?.errors)
          this.errors = err.response.data.error.errors;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
