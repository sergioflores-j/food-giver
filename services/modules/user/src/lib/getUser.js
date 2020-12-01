// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import UserDao from '@shared/dao/UserDao';

/**
 * @param {object} param0
 * @param {string} param0.email
 */
export const get = async ({ email }) => {
  checkParameters({ email });

  return run({ email });
};

export const run = async ({ email }) => {
  try {
    const user = await new UserDao().get({ email, excludePassword: true });

    return user;
  } catch (err) {
    console.log('Error get Run', err);
    console.log('Params: ', {
      email,
    });
    throw err;
  }
};

const checkParameters = ({ email }) => {
  const errors = {};

  if (!email) errors.email = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default get;
