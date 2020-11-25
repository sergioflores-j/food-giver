<template>
  <v-container>
    <v-alert outlined type="info">
      Já é cadastrado?
      <router-link to="/login">
        Ir para o login.
      </router-link>
    </v-alert>
    <user-form
      :loading="loading"
      :errors="errors"
      @submit="submit"
    />
  </v-container>
</template>

<script>
import UserForm from '@/components/UserForm.vue';
import { create } from '@/services/user';

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
        await create(user);

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
