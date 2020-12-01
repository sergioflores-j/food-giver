// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import NecessityDao from '@shared/dao/NecessityDao';

/**
 * @param {object} param0
 * @param {string} param0.userEmail
 * @param {boolean} [param0.showFinished]
 */
export const list = async ({ userEmail, showFinished = true }) => {
  const params = { userEmail, showFinished };

  checkParameters(params);

  return run(params);
};

export const run = async ({ userEmail, showFinished }) => {
  try {
    const necessities = await new NecessityDao().query({
      userEmail,
      fields: ['necessityId', 'foodName', 'quantity', 'finished', 'createdAt', 'updatedAt', 'donations'],
    });

    // TODO: improve this filter
    if (!showFinished)
      return { necessities: filterNecessities(necessities) };

    return { necessities };
  } catch (err) {
    console.log('Error ListNecessities Run', err);
    console.log('Params: ', {
      userEmail,
    });
    throw err;
  }
};

export const filterNecessities = necessities => (
  necessities.filter(necessity => !necessity.finished)
);

const checkParameters = ({ userEmail }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default list;
