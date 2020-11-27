// @ts-check
import { v4 as uuid } from 'uuid';
import { error } from '@shared/utils/utils';
import { isObject } from 'deep-object-js';
import env from '@root/ms.env';

import NecessityDao from '@shared/dao/NecessityDao';
import necessitySchema from '@shared/schemas/necessity';

/**
 * @param {object} param0
 * @param {import('../../../../../types/Necessity').Necessity} param0.necessity
 * @param {string} param0.userEmail
 */
export const create = async ({ necessity, userEmail }) => {
  checkParameters({ necessity, userEmail });

  return run({ necessity, userEmail });
};

export const run = async ({ userEmail, necessity }) => {
  try {
    // TODO: check if user exists?

    const necessityItem = {
      ...necessity,
      necessityId: uuid(),
      userEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await necessitySchema.validate(necessityItem, { abortEarly: false });

    await new NecessityDao().create({ necessity: necessityItem });

    return { necessity: necessityItem };
  } catch (err) {
    console.log('Error CreateNecessity Run', err);
    console.log('Params: ', {
      necessity,
    });
    throw err;
  }
};

const checkParameters = ({ userEmail, necessity }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';
  if (!necessity) errors.necessity = 'undefined';
  else if (!isObject(necessity)) errors.necessity = 'is not an object';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default create;
