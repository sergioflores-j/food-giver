// @ts-check
import { v4 as uuid } from 'uuid';
import { error } from '@shared/utils/utils';
import { isObject } from 'deep-object-js';
import env from '@root/ms.env';

import DonationDao from '@shared/dao/DonationDao';
import donationSchema from '@shared/schemas/donation';

/**
 * @param {object} param0
 * @param {import('../../../../../types/Donation').Donation} param0.donation
 */
export const create = async ({ donation }) => {
  checkParameters({ donation });

  return run({ donation });
};

export const run = async ({ donation }) => {
  try {
    const donationItem = {
      ...donation,
      donationId: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await donationSchema.validate(donationItem, { abortEarly: false });

    await new DonationDao().create({ donation: donationItem });

    return { donation: donationItem };
  } catch (err) {
    console.log('Error CreateDonation Run', err);
    console.log('Params: ', {
      donation,
    });
    throw err;
  }
};

const checkParameters = ({ donation }) => {
  const errors = {};

  if (!donation) errors.donation = 'undefined';
  else if (!isObject(donation)) errors.donation = 'is not an object';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default create;
