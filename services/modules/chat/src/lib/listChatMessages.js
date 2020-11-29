// @ts-check
import { error, sortByDate } from '@shared/utils/utils';
import env from '@root/ms.env';

import ChatMessageDao from '@shared/dao/ChatMessageDao';

/**
 * @param {object} param0
 * @param {string} param0.chatId
 */
export const list = async ({ chatId }) => {
  checkParameters({ chatId });

  return run({ chatId });
};

export const run = async ({ chatId }) => {
  try {
    const messages = await new ChatMessageDao().queryByChatId({ chatId });

    return { messages: sortByDate(messages, 'createdAt', 'desc') };
  } catch (err) {
    console.log('Error ListChatMessages Run', err);
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

export default list;
