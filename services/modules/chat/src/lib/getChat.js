// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import ChatDao from '@shared/dao/ChatDao';

/**
 * @param {object} param0
 * @param {string} param0.chatId
 */
export const get = async ({ chatId }) => {
  checkParameters({ chatId });

  return run({ chatId });
};

export const run = async ({ chatId }) => {
  try {
    const chat = await new ChatDao().get({
      chatId,
    });

    return chat;
  } catch (err) {
    console.log('Error GetChats Run', err);
    console.log('Params: ', {
      chatId,
    });
    throw err;
  }
};

const checkParameters = ({ chatId }) => {
  const errors = {};

  if (!chatId) errors.chatId = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default get;
