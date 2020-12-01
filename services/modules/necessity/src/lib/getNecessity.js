// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import NecessityDao from '@shared/dao/NecessityDao';

/**
 * @param {object} param0
 * @param {string} param0.necessityId
 * @param {string} param0.userEmail
 */
export const get = async ({ necessityId, userEmail }) => {
  checkParameters({ necessityId, userEmail });

  return run({ necessityId, userEmail });
};

export const run = async ({ userEmail, necessityId }) => {
  try {
    return await new NecessityDao().get({ necessityId, userEmail });
  } catch (err) {
    console.log('Error getNecessity Run', err);
    console.log('Params: ', {
      necessityId,
      userEmail,
    });
    throw err;
  }
};

const checkParameters = ({ userEmail, necessityId }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';
  if (!necessityId) errors.necessityId = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default get;
