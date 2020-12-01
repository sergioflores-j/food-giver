// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import DonationDao from '@shared/dao/DonationDao';

/**
 * @param {object} param0
 * @param {string} param0.userEmail
 */
export const list = async ({ userEmail }) => {
  checkParameters({ userEmail });

  return run({ userEmail });
};

export const run = async ({ userEmail }) => {
  try {
    const donations = await new DonationDao().query({
      userEmail,
      fields: ['donationId', 'foodName', 'condition', 'createdAt', 'updatedAt', 'expiresAt'],
    });

    return { donations };
  } catch (err) {
    console.log('Error ListDonationsByUser Run', err);
    console.log('Params: ', {
      userEmail,
    });
    throw err;
  }
};

const checkParameters = ({ userEmail }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default list;
