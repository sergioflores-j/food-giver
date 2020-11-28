// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import { createOrUpdateChat } from './createOrUpdateChat';

/**
 * @param {object} param0
 * @param {string} param0.participant1
 * @param {string} param0.participant2
 */
export const create = async ({ participant1, participant2 }) => {
  checkParameters({ participant1, participant2 });

  return run({ participant1, participant2 });
};

export const run = async ({ participant1, participant2 }) => {
  try {
    // TODO: check if user exists?

    const chat = await createOrUpdateChat({
      participant1,
      participant2,
    });

    return { chat };
  } catch (err) {
    console.log('Error CreateChat Run', err);
    console.log('Params: ', {
      participant1,
      participant2,
    });
    throw err;
  }
};

const checkParameters = ({ participant1, participant2 }) => {
  const errors = {};

  if (!participant1) errors.participant1 = 'undefined';
  if (!participant2) errors.participant2 = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default create;
