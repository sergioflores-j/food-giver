<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step
        step="1"
        :complete="step > 1"
        :editable="!isLoading && step > 1"
      >
        Conta Food Giver
      </v-stepper-step>
      <v-divider />
      <v-stepper-step
        step="2"
        :complete="step > 2"
        :editable="!isLoading && step > 2"
      >
        Dados pessoais
      </v-stepper-step>
      <v-divider />
      <v-stepper-step
        step="3"
        :complete="step > 3"
        :editable="!isLoading && step > 3"
      >
        Endereço
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-form ref="form" v-model="validStep[1]">
          <v-text-field
            v-model="form.email"
            :loading="isLoading"
            :rules="[formRules.required, ...formRules.emailRules]"
            label="E-mail"
            autofocus
            required
          />

          <v-text-field
            v-model="form.password"
            :loading="isLoading"
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[formRules.required, passwordMatch]"
            :type="showPwd ? 'text' : 'password'"
            name="password"
            label="Senha"
            @click:append="showPwd = !showPwd"
          />

          <v-text-field
            v-model="form.passwordConfirm"
            :loading="isLoading"
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[formRules.required, passwordMatch]"
            :type="showPwd ? 'text' : 'password'"
            name="passwordConfirm"
            label="Confirmar Senha"
            @click:append="showPwd = !showPwd"
          />

          <v-select
            v-model="form.profile"
            :loading="isLoading"
            :items="profiles"
            :rules="[formRules.required]"
            label="Perfil"
            required
          />

          <v-alert v-if="existentUserError === this.form.email" type="warning">
            Usuário já cadastrado!
          </v-alert>

          <v-btn
            color="primary"
            :disabled="!validStep[1]"
            @click.native="submitFirstStep"
          >
            Continuar
          </v-btn>
        </v-form>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-form ref="form" v-model="validStep[2]">
          <v-text-field
            v-model="form.name"
            :loading="isLoading"
            label="Nome"
            required
            autofocus
          />

          <v-text-field
            v-model="form.federalId"
            :loading="isLoading"
            :rules="[formRules.required, ...formRules.personalIdRules]"
            type="tel"
            label="CPF/CNPJ"
            required
          />

          <v-text-field
            v-model="form.phone"
            :loading="isLoading"
            :rules="[formRules.required, ...formRules.phoneRules]"
            type="tel"
            label="Telefone/Celular"
            required
          />

          <v-btn text @click.native="step = 1">
            Voltar
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!validStep[2]"
            @click.native="step = 3"
          >
            Continuar
          </v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-form ref="form" v-model="validStep[3]">
          <v-text-field
            v-model="form.address.street"
            :loading="isLoading"
            :rules="[formRules.required]"
            label="Rua"
            autofocus
            required
          />
          <v-text-field
            v-model="form.address.number"
            :loading="isLoading"
            :rules="[formRules.required]"
            label="Número"
            required
          />
          <v-text-field
            v-model="form.address.zipCode"
            label="CEP"
            :loading="isLoading"
          />
          <v-text-field
            v-model="form.address.complement"
            label="Complemento"
            :loading="isLoading"
          />
          <v-text-field
            v-model="form.address.city"
            :loading="isLoading"
            :rules="[formRules.required]"
            label="Cidade"
            required
          />
          <v-select
            v-model="form.address.state"
            :loading="isLoading"
            :items="states"
            :rules="[formRules.required]"
            label="Estado"
            required
          />

          <v-alert v-if="errors.length" type="error">
            Não foi possível criar seu usuário devido ao seguintes motivos:

            <ul>
              <li v-for="error of errors" :key="error">
                {{ error }}
              </li>
            </ul>
          </v-alert>

          <v-btn text @click.native="step = 2">
            Voltar
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!validStep[3]"
            :loading="isLoading"
            @click="submit"
          >
            Enviar
          </v-btn>
        </v-form>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { isEmail, isCpfCnpj, isPhone } from '@/utils/validation';
import profiles from '@/constants/profiles';
import states from '@/constants/states';
import UserService from '@/services/UserService';

export default {
  name: 'UserForm',
  props: {
    loading: { type: Boolean, default: false },
    errors: { type: Array, default: () => [] },
  },
  data() {
    return {
      internalLoading: false,
      validStep: {
        1: true,
        2: true,
        3: true,
        4: true,
      },
      existentUserError: false,
      step: 1,
      showPwd: false,
      form: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        federalId: '',
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
      },
    };
  },
  computed: {
    isLoading() {
      return this.internalLoading || this.loading;
    },
    passwordMatch() {
      return this.form.password === this.form.passwordConfirm || 'Senhas não combinam';
    },
  },
  methods: {
    submit() {
      this.$emit('submit', { ...this.form });
    },
    async submitFirstStep() {
      if (this.form.email === this.existentUserError) return;

      this.internalLoading = true;
      const { exists } = await UserService.checkExistentUser(this.form.email);
      this.internalLoading = false;

      if (exists) {
        this.existentUserError = this.form.email;

        return;
      }

      this.step = 2;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
