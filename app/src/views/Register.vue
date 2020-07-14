<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="name"
      label="Nome"
      required
    />

    <v-text-field
      v-model="email"
      :rules="[formRules.required, ...formRules.emailRules]"
      label="E-mail"
      required
    />

    <v-text-field
      v-model="password"
      :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[formRules.required, formRules.passwordMatch]"
      :type="showPwd ? 'text' : 'password'"
      name="password"
      label="Senha"
      @click:append="showPwd = !showPwd"
    />

    <v-text-field
      v-model="passwordConfirm"
      :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[formRules.required, formRules.passwordMatch]"
      :type="showPwd ? 'text' : 'password'"
      name="passwordConfirm"
      label="Confirmar Senha"
      @click:append="showPwd = !showPwd"
    />

    <!-- TODO -->
    <v-text-field
      v-model="personalId"
      :rules="entityRules"
      label="CPF"
      required
    />

    <v-select
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'Item is required']"
      label="Item"
      required
    />

    <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    />

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validate
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Reset Form
    </v-btn>

    <v-btn
      color="warning"
      @click="resetValidation"
    >
      Reset Validation
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      valid: true,
      name: '',
      // CAMPOS:
      // nome
      // email
      // senha
      // confirma senha

      // cpf/cnpj
      // telefone

      // endereço
      // rua
      // numero
      // cep
      // complemento
      // cidade
      // bairro
      // estado

      // perfil (beneficiado|doador)

      formRules: {
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: {
          // required: value => !!value || 'Campo obrigatório',
        },
        required: value => !!value || 'Campo obrigatório',
        passwordMatch: () => ('The email and password you entered don\'t match'),
      },
      email: '',
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: false,
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
