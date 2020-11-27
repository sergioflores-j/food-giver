const yup = require('yup');
const { isCnpjCpf, isPhone } = require('../utils/utils');
const { profiles } = require('../constants/user');

const schema = yup.object({
  address: yup.object().shape({
    city: yup.string().required(),
    complement: yup.string(),
    neighborhood: yup.string().required(),
    number: yup.string().required(),
    state: yup.string().required(),
    street: yup.string().required(),
    zipCode: yup.string(),
  }),
  createdAt: yup.string().default(() => new Date().toISOString()).required(),
  email: yup.string().required().email(),
  federalId: yup.string().test('is-federalid', 'federalId is invalid', val => isCnpjCpf(val)),
  isActive: yup.boolean(),
  name: yup.string().required(),
  password: yup.string().required(),
  phone: yup.string().required().test('is-phone', 'phone is invalid', val => isPhone(val)),
  profile: yup.string().required().test('is-profile', 'profile is invalid', val => profiles.includes(val)),
  updatedAt: yup.string().default(() => new Date().toISOString()).required(),
})
  .noUnknown();

module.exports = schema;
