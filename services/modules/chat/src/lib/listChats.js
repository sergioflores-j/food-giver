// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import ChatDao from '@shared/dao/ChatDao';

/**
 * @param {object} param0
 * @param {string} param0.userEmail
 */
export const list = async ({ userEmail }) => {
  checkParameters({ userEmail });

  return run({ userEmail });
};

export const run = async ({ userEmail }) => {
  try {
    const chats = await new ChatDao().list({
      userEmail,
      fields: ['chatId', 'participant1', 'participant2', 'createdAt', 'updatedAt'],
    });

    return { chats };
  } catch (err) {
    console.log('Error ListChats Run', err);
    console.log('Params: ', {
      userEmail,
    });
    throw err;
  }
};

const checkParameters = ({ userEmail }) => {
  const errors = {};

  if (!userEmail) errors.userEmail = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default list;
