const GenericDao = require('../../../../shared/dao/GenericDao');

const TABLE_NAME = 'FG.Donation';

const getParameters = event => {
  if (!event.body) {
    throw {
      statusCode: 400,
      message: 'Deve ser informado um body',
    };
  }

  return {
    body: JSON.parse(event.body),
  };
};

/**
 * @param {Donation} donation
 */
const validateDonation = donation => {
  const errors = {};

  if (!donation.product) errors.product = 'undefined';
  else if (typeof donation.product !== 'string') errors.product = 'invalid value';
  
  if (!donation.expiresDate) errors.expiresDate = 'undefined';
  
  if (!donation.daysWithDonor) errors.daysWithDonor = 'undefined';
  else if (typeof donation.daysWithDonor !== 'number') errors.daysWithDonor = 'invalid value';

  if (!donation.productCondition) errors.productCondition = 'undefined';

  return (Object.keys(errors).length > 0) ? errors : undefined;
};

module.exports.run = async event => {
  try {
    const { body } = getParameters(event);
    const errors = validateDonation(body);

    if (errors) {
      throw {
        statusCode: 422,
        message: 'Invalid donation',
        error: {
          invalidFields: errors,
        },
      };
    }

    const donationCreated = await new GenericDao()._put({
      TableName: , 
      Item: item,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...donationCreated,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || 'Internal Server Error',
        error: error.error,
      }),
    };
  }
};
