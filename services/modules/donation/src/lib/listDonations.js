// @ts-check
import { sortByDate } from '@shared/utils/utils';

import DonationDao from '@shared/dao/DonationDao';

export const list = async () => run();

export const run = async () => {
  try {
    // TODO: listar doações próximas da localização recebida por parametro.
    const donations = await new DonationDao().scan({
      fields: ['donationId', 'userEmail', 'foodName', 'condition', 'createdAt', 'updatedAt', 'expiresAt'],
    });

    return { donations: sortByDate(donations, 'updatedAt', 'desc') };
  } catch (err) {
    console.log('Error ListDonations Run', err);
    throw err;
  }
};

export default list;
