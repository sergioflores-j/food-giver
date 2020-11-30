// @ts-check
import { sortByDate } from '@shared/utils/utils';

import DonationDao from '@shared/dao/DonationDao';

export const list = async ({ sessionUser }) => run({ sessionUser });

export const run = async ({ sessionUser }) => {
  try {
    // TODO: listar doações próximas da localização recebida por parametro.
    const donations = await new DonationDao().scan({
      fields: ['donationId', 'userEmail', 'foodName', 'condition', 'finished', 'createdAt', 'updatedAt', 'expiresAt'],
    });

    return {
      donations: sortByDate(
        filterDonations(donations, { sessionUser }),
        'updatedAt',
        'desc',
      ),
    };
  } catch (err) {
    console.log('Error ListDonations Run', err);
    throw err;
  }
};

// TODO: deixar mais declarativo/funcional
export const filterDonations = (donations, { sessionUser = '' } = {}) => (
  donations.filter(donation => {
    let valid = true;

    if (sessionUser)
      valid = donation.userEmail !== sessionUser;

    if (donation.finished) valid = false;

    return valid;
  })
);

export default list;
