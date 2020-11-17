// @ts-check
import { error, generateHash } from '@shared/utils/utils';
import env from '@root/ms.env';
import { sign } from 'jsonwebtoken';

import UserDao from '@shared/dao/UserDao';

const JWT_EXPIRATION_TIME = '15m';
const COMMON_ERROR = 'invalid email/password';

/**
 * Returns a JWT, given a email and password.
 * @param {object} param0
 * @param {string} param0.email
 * @param {string} param0.password
 * @throws Returns 401 if the user is not found or password is invalid.
 */
export const login = async ({ email, password }) => {
  checkParameters({ email, password });

  return run({ email, password });
};

export const run = async ({ email, password }) => {
  try {
    const { password: savedPassword, ...user } = await getUser({ email });

    if (generateHash(password) !== savedPassword)
      throw error(env.STATUS_UNAUTHORIZED, COMMON_ERROR);

    // Issue JWT
    const token = sign({ user }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

    return { user, token };
  } catch (err) {
    console.log('Error Login Run', err);
    console.log('Params: ', {
      email,
      password,
    });
    throw err;
  }
};

const getUser = async ({ email }) => {
  const user = await new UserDao().get({
    email,
    fields: ['name', 'phone', 'profile', 'federalId', 'password'],
  });

  if (!user) throw error(env.STATUS_UNAUTHORIZED, COMMON_ERROR);

  return user;
};

const checkParameters = ({ email, password }) => {
  const errors = {};

  if (!email) errors.email = 'undefined';
  if (!password) errors.password = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_UNAUTHORIZED, errors);
};

export default login;
