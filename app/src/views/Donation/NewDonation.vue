<template>
  <v-container>
    <v-btn icon to="/donations" :disabled="isLoading">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-form
      ref="form"
      v-model="isValid"
    >
      <v-row>
        <v-col cols="12">
          <!-- <v-combobox -->
          <v-text-field
            v-model="form.foodName"
            :rules="[formRules.required]"
            label="Produto"
            type="text"
            autofocus
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto" sm="12">
          <v-text-field
            v-model="form.expiresAt"
            :rules="[formRules.required]"
            label="Validade"
            type="date"
            required
          />
        </v-col>
        <v-col cols="auto" sm="12">
          <v-text-field
            v-model="form.daysWithGiver"
            :rules="[formRules.required]"
            label="Dias com o doador"
            type="number"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="form.condition"
            :items="items"
            :rules="[formRules.required]"
            label="Condição do alimento"
            type="text"
            item-value="value"
            required
          />
        </v-col>
      </v-row>

      <v-alert v-if="showErrors" type="error">
        Não foi possível criar a doação.

        <template v-if="errors.length">
          Motivos:
          <ul>
            <li v-for="error of errors" :key="error">
              {{ error }}
            </li>
          </ul>
        </template>
      </v-alert>
      <v-row>
        <v-col cols="12" class="d-flex flex-wrap justify-space-between">
          <v-btn text :loading="isLoading" to="/donations">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="isLoading"
            @click="submit"
          >
            Enviar
          </v-btn>
        </v-col>
      </v-row>
      <pre><code>{{ form }}</code></pre>
      <pre><code>{{ hasChanges }}</code></pre>
    </v-form>
  </v-container>
</template>

<script>
import { create } from '@/services/donation';
import { conditions } from '@/constants/donation';

const initialForm = {
  foodName: '',
  daysWithGiver: 10,
  expiresAt: '',
  condition: '',
};
// TODO: buscar o alimento enquanto digita, pode ser um component, dá pra usar v-combobox
export default {
  name: 'NewDonationView',
  beforeRouteLeave(to, from, next) {
    if (!this.hasChanges) return next();

    // eslint-disable-next-line no-alert
    const answer = window.confirm('Você irá perder suas alterações, deseja continuar?');

    if (answer) next();
    else next(false);
  },
  data() {
    return {
      isValid: true,
      form: { ...initialForm },
      items: [
        ...(
          Object.entries(conditions)
            .map(([key, value]) => ({ text: value.label, value: key }))
        ),
      ],
      formRules: {
        required: value => !!value || 'Campo obrigatório',
      },
      showErrors: false,
      errors: [],
      isLoading: false,
    };
  },
  computed: {
    hasChanges() {
      if (!this.form) return false;

      return Object.entries(this.form).some(([key, value]) => value !== initialForm[key]);
    },
  },
  methods: {
    async submit() {
      if (this.isLoading) return;
      try {
        this.$refs.form.validate();

        if (!this.isValid) return;

        this.isLoading = true;

        const response = await create({
          ...this.form,
          finished: false,
          expiresAt: new Date(this.form.expiresAt).toISOString(),
        });

        this.form = { ...initialForm };

        this.$router.push('/donations');

        return response;
      } catch (err) {
        console.log('err Donation create', err);
        this.errors = err.response.data.error?.errors;
        this.showErrors = true;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
