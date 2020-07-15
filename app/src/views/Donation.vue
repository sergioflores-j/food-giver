<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col cols="12">
            <v-text-field
            v-model="product"
            :rules="[v => !!v || 'informação obrigatória']"
            label="Produto"
            type="text"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="expiresDate"
            :rules="[v => !!v || 'informação obrigatória']"
            label="Validade"
            type="date"
            required
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="daysWithDonor"
            :rules="[v => !!v || 'informação obrigatória']"
            label="Dias com o doador"
            type="number"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-combobox
            v-model="productCondition"
            :items="items"
            :rules="[v => !!v || 'informação obrigatória']"
            label="Condição do alimento"
            type="text"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn
            :disabled="!valid"
            color="success"
            @click="submit"
          >
            Cadastrar Doação
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="js" >
export default {
  data() {
    return {
      valid: true,
      product: '',
      expiresDate: '',
      daysWithDonor: '',
      productCondition: '',
      items: [
        'Bem conservado',
        'Próprio para consumo em curto tempo',
        'Próprio para utilização como dejeto',
      ],
    };
  },
  methods: {
    submit() {
      try {
        const response = await axios({
          method: 'GET',
          url: `localhost:/v1/donation/`,
          headers: {
            apikey: process.env.apikey,
          },
          params: {
            entityCode: cnpjCompany,
            xmlFile: true,
          }
        });

        return response;

      } catch (err) {
        console.log('err Donation create', err);
      }
    },
  },
};
</script>
