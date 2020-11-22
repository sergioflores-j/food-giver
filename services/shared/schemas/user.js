const yup = require('yup');
const { isCnpjCpf } = require('../utils/utils');

const schema = yup.object({
  address: yup.object().shape({
    city: yup.string().required(),
    complement: yup.string(),
    neighborhood: yup.string().required(),
    number: yup.string().required(),
    state: yup.string().required(),
    street: yup.string().required(),
    zipCode: yup.string().test('is-cep', 'zipCode is invalid', val => {
      if (!val) return false;
      if (val.length === 8) return true;

      return false;
    }),
  }),
  createdAt: yup.string().default(() => new Date().toISOString()).required(),
  email: yup.string().required().email(),
  federalId: yup.string().test('is-federalid', 'federalId is invalid', val => isCnpjCpf(val)),
  isActive: yup.boolean(),
  name: yup.string().required(),
  password: yup.string().required(),
  phone: yup.string().required(),
  profile: yup.string().required(),
  updatedAt: yup.string().default(() => new Date().toISOString()).required(),
});

module.exports = schema;
