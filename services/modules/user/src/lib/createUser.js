// @ts-check
import { error, generateHash } from '@shared/utils/utils';
import { isObject } from 'deep-object-js';
import env from '@root/ms.env';

import UserDao from '@shared/dao/UserDao';
import userSchema from '@shared/schemas/user';

/**
 * @param {object} param0
 * @param {import('../../../../../types/User').User} param0.user
 */
export const create = async ({ user }) => {
  checkParameters({ user });

  await run({ user });
};

export const run = async ({ user }) => {
  try {
    await userSchema.validate(user, { abortEarly: false });

    const userItem = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      password: generateHash(user.password),
    };

    await new UserDao().create({ user: userItem });

    return { user: userItem };
  } catch (err) {
    console.log('Error CreateUser Run', err);
    console.log('Params: ', {
      user,
    });
    throw err;
  }
};

const checkParameters = ({ user }) => {
  const errors = {};

  if (!user) errors.user = 'undefined';
  else if (!isObject(user)) errors.user = 'is not an object';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default create;
