const yup = require('yup');
const { conditions } = require('../constants/food');

const schema = yup.object({
  userEmail: yup.string().required().email(),
  donationId: yup.string().required().uuid(),
  foodName: yup.string().required(),
  condition: yup.string().required().test('is-condition', 'condition is invalid', val => conditions.includes(val)),
  daysWithGiver: yup.number(),
  expiresAt: yup.string().required(),
  finished: yup.boolean(),
  directedTo: yup.array().of(yup.object({
    necessityId: yup.string().uuid().required(),
    userEmail: yup.string().email().required(),
  })),
  createdAt: yup.string().default(() => new Date().toISOString()).required(),
  updatedAt: yup.string().default(() => new Date().toISOString()).required(),
});

module.exports = schema;
