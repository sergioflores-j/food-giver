// @ts-check
import { error } from '@shared/utils/utils';
import { isObject } from 'deep-object-js';
import env from '@root/ms.env';

import NecessityDao from '@shared/dao/NecessityDao';
import DonationDao from '@shared/dao/DonationDao';

/**
 * @param {object} param0
 * @param {import('../../../../../types/Donation').Donation} param0.donation
 * @param {string} param0.userEmail
 * @param {string} param0.necessityId
 */
export const select = async ({ donation, userEmail, necessityId }) => {
  const params = { donation, userEmail, necessityId };

  checkParameters(params);

  return run(params);
};

export const run = async ({ donation, userEmail, necessityId }) => {
  try {
    const [updated, updatedNecessities] = await Promise.all([
      new NecessityDao().updateDonations({
        userEmail,
        necessityId,
        newDonation: {
          ...donation,
          createdAt: new Date().toISOString(),
        },
      }),
      new DonationDao().updateDirectedTo({
        userEmail,
        donationId: donation.donationId,
        newNecessity: {
          userEmail,
          necessityId,
          createdAt: new Date().toISOString(),
        },
      }),
    ]);

    console.log('updated :>> ', updated);
    console.log('updatedNecessities :>> ', updatedNecessities);

    // TODO: criar middleware para realizar isso
    await Promise.all([
      new NecessityDao().updateControlFields({
        userEmail,
        necessityId,
      }),
      new DonationDao().updateControlFields({
        userEmail,
        donationId: donation.donationId,
      }),
    ]);

    return {
      updated: {
        ...updated,
        ...updatedNecessities,
      },
    };
  } catch (err) {
    console.log('Error selectDonation Run', err);
    console.log('Params: ', {
      donation,
    });
    throw err;
  }
};

const checkParameters = ({ donation, userEmail, necessityId }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';
  if (!necessityId) errors.necessityId = 'undefined';

  if (!isObject(donation)) {
    errors.donation = 'is not an object';
  } else {
    if (!donation.userEmail) errors.userEmail = 'invalid';
    if (!donation.donationId) errors.donationId = 'invalid';
  }

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default select;
