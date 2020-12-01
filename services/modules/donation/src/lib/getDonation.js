// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import DonationDao from '@shared/dao/DonationDao';
import UserDao from '@shared/dao/UserDao';

/**
 * @param {object} param0
 * @param {string} param0.userEmail
 * @param {string} param0.donationId
 */
export const get = async ({ userEmail, donationId }) => {
  checkParameters({ userEmail, donationId });

  return run({ userEmail, donationId });
};

export const run = async ({ userEmail, donationId }) => {
  try {
    const donation = await new DonationDao().get({
      userEmail,
      donationId,
    });

    const user = await new UserDao().get({
      email: userEmail,
      fields: ['address', 'phone', 'federalId', 'email', 'name', 'isActive'],
      excludePassword: true,
    });

    return { donation, user };
  } catch (err) {
    console.log('Error getDonation Run', err);
    console.log('Params: ', {
      userEmail,
    });
    throw err;
  }
};

const checkParameters = ({ userEmail, donationId }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';
  if (!donationId) errors.donationId = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default get;
