const yup = require('yup');

const schema = yup.object({
  userEmail: yup.string().required().email(),
  necessityId: yup.string().required().uuid(),
  foodName: yup.string().required(),
  quantity: yup.number().required(),
  finished: yup.boolean(),
  donations: yup.array().of(yup.object({
    donationId: yup.string().uuid().required(),
    userEmail: yup.string().email().required(),
  })),
  createdAt: yup.string().default(() => new Date().toISOString()).required(),
  updatedAt: yup.string().default(() => new Date().toISOString()).required(),
})
  .strict()
  .noUnknown();

module.exports = schema;
