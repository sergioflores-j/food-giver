// @ts-check
import { v4 as uuid } from 'uuid';
import { error } from '@shared/utils/utils';
import { isObject } from 'deep-object-js';
import env from '@root/ms.env';

import DonationDao from '@shared/dao/DonationDao';

/**
 * @param {object} param0
 * @param {string} param0.userEmail
 * @param {number} param0.donationId
 * @param {boolean} param0.status
 */
export const changeStatus = async ({ donationId, userEmail, status }) => {
  checkParameters({ donationId, userEmail, status });

  return run({ donationId, userEmail, status });
};

export const run = async ({ userEmail, donationId, status }) => {
  try {
    // TODO: check if user exists?

    await new DonationDao().updateStatus({ userEmail, donationId, status});

    return { donation: donationId };
  } catch (err) {
    console.log('Error ChangeStatusDonation Run', err);
    console.log('Params: ', {
      donationId,
      status,
    });
    throw err;
  }
};

const checkParameters = ({ userEmail, donationId, status }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';
  if (!status) errors.status = 'undefined';
  if (!donationId) errors.donationId = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default changeStatus;
