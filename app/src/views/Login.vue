<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-row>
        <v-col>
          <app-title />
        </v-col>
      </v-row>

      <v-alert v-if="error" type="error">
        {{ error }}
      </v-alert>

      <v-row>
        <v-col
          cols="12"
          sm="12"
          md="6"
        >
          <v-text-field
            v-model="email"
            :rules="formRules.emailRules"
            label="E-mail"
            name="email"
            :loading="loading"
            clearable
            required
            autofocus
          />
        </v-col>

        <v-col
          cols="12"
          sm="12"
          md="6"
        >
          <v-text-field
            v-model="password"
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[formRules.passwordRules.required]"
            :type="showPwd ? 'text' : 'password'"
            name="password"
            label="Senha"
            :loading="loading"
            @keydown.enter="submit"
            @click:append="showPwd = !showPwd"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <router-link to="/register">
            Cadastre-se
          </router-link>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn
            :disabled="!valid"
            :loading="loading"
            color="success"
            @click="submit"
          >
            <v-icon left>
              mdi-login
            </v-icon>
            Entrar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import AppTitle from '@/components/AppTitle.vue';

export default {
  name: 'Login',
  components: {
    AppTitle,
  },
  data() {
    return {
      valid: true,
      showPwd: false,
      error: '',
      email: '',
      password: '',
      formRules: {
        emailMatch: () => ('The email and password you entered don\'t match'),
        passwordRules: {
          required: value => !!value || 'Campo obrigatório',
        },
        emailRules: [
          v => !!v || 'Campo obrigatório',
          v => /.+@.+\..+/.test(v) || 'E-mail inválido.',
        ],
      },
      loading: false,
    };
  },
  methods: {
    submit() {
      const isValid = this.$refs.form.validate();

      if (!isValid) return;

      this.loading = true;
      this.error = '';

      this.$store.dispatch('auth/login', { email: this.email, password: this.password })
        .catch(err => {
          console.error('Login error', err);

          const errMessage = err.response?.data?.error?.message;

          if (err.response.status === 401) this.error = 'Usuário e/ou senha inválidos';
          else this.error = `Ocorreu um erro. ${errMessage ? `(${errMessage})` : ''}`;
        })
        .then(() => this.$router.push({ path: '/', query: this.$route.query }))
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.col-12, .col {
  padding-bottom: 0px;
  padding-top: 0px;
}
</style>
