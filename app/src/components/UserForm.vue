<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      v-model="form.name"
      :loading="loading"
      label="Nome"
      required
      autofocus
    />

    <v-text-field
      v-model="form.email"
      :loading="loading"
      :rules="[formRules.required, ...formRules.emailRules]"
      label="E-mail"
      required
    />

    <v-text-field
      v-model="form.password"
      :loading="loading"
      :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[formRules.required, formRules.passwordMatch]"
      :type="showPwd ? 'text' : 'password'"
      name="password"
      label="Senha"
      @click:append="showPwd = !showPwd"
    />

    <v-text-field
      v-model="form.passwordConfirm"
      :loading="loading"
      :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[formRules.required, formRules.passwordMatch]"
      :type="showPwd ? 'text' : 'password'"
      name="passwordConfirm"
      label="Confirmar Senha"
      @click:append="showPwd = !showPwd"
    />

    <v-text-field
      v-model="form.personalId"
      :loading="loading"
      :rules="[formRules.required, ...formRules.personalIdRules]"
      type="tel"
      label="CPF/CNPJ"
      required
    />

    <v-text-field
      v-model="form.phone"
      :loading="loading"
      :rules="[formRules.required, ...formRules.phoneRules]"
      type="tel"
      label="Telefone/Celular"
      required
    />

    <v-text-field
      v-model="form.address.street"
      :loading="loading"
      :rules="[formRules.required]"
      label="Rua"
      required
    />
    <v-text-field
      v-model="form.address.number"
      :loading="loading"
      :rules="[formRules.required]"
      label="Número"
      required
    />
    <v-text-field
      v-model="form.address.zipCode"
      label="CEP"
      :loading="loading"
    />
    <v-text-field
      v-model="form.address.complement"
      label="Complemento"
      :loading="loading"
    />
    <v-text-field
      v-model="form.address.city"
      :loading="loading"
      :rules="[formRules.required]"
      label="Cidade"
      required
    />

    <v-select
      v-model="form.address.state"
      :loading="loading"
      :items="states"
      :rules="[formRules.required]"
      label="Estado"
      required
    />

    <v-select
      v-model="form.profile"
      :loading="loading"
      :items="profiles"
      :rules="[formRules.required]"
      label="Perfil"
      required
    />

    <v-btn :disabled="!valid" :loading="loading" @click="submit">
      Enviar
    </v-btn>
  </v-form>
</template>

<script>
import { isEmail, isCpfCnpj, isPhone } from '@/utils/validation';
import profiles from '@/constants/profiles';
import states from '@/constants/states';

export default {
  name: 'UserForm',
  props: {
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      valid: true,
      showPwd: false,
      form: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        personalId: '',
        phone: '',
        address: {
          street: '',
          number: '',
          zipCode: '',
          complement: '',
          city: '',
          neighborhood: '',
          state: null,
        },
        profile: null,
      },
      states,
      profiles: Object.entries(profiles).map(([key, { label } = {}]) => ({
        text: label, value: key,
      })),
      formRules: {
        required: value => !!value || 'Campo obrigatório',
        emailRules: [
          v => isEmail(v) || 'E-mail inválido',
        ],
        phoneRules: [
          v => isPhone(v) || 'Telefone inválido',
        ],
        personalIdRules: [
          v => isCpfCnpj(v) || 'CNPJ/CPF inválido',
        ],
        passwordMatch: v => {
          // TODO: verificar bug com essa rule
          console.log('p', this.form.password, '- c', this.form.passwordConfirm);
          console.log('this.form.password === this.form.passwordConfirm', this.form.password === this.form.passwordConfirm);
          console.log('v', v);
          return this.form.password === this.form.passwordConfirm || 'Senhas não combinam';
        },
      },
    };
  },
  mounted() {
    this.resetValidation();
  },
  methods: {
    submit() {
      this.$refs.form.validate();

      this.$emit('submit', { ...this.form });
    },
    // reset() {
    //   this.$refs.form.reset();
    // },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
