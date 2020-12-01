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
 * @param {boolean} param0.finished
 */
export const changeStatus = async ({ donationId, userEmail, finished }) => {
  checkParameters({ donationId, userEmail, finished });

  return run({ donationId, userEmail, finished });
};

export const run = async ({ userEmail, donationId, finished }) => {
  try {
    // TODO: check if user exists?

    await new DonationDao().updateStatus({ userEmail, donationId, finished });

    return { donation: donationId };
  } catch (err) {
    console.log('Error ChangeStatusDonation Run', err);
    console.log('Params: ', {
      donationId,
      finished,
    });
    throw err;
  }
};

const checkParameters = ({ userEmail, donationId, finished }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';
  if (!finished) errors.finished = 'undefined';
  if (!donationId) errors.donationId = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default changeStatus;
