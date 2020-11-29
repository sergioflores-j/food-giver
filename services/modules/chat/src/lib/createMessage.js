// @ts-check
import { v4 as uuid } from 'uuid';
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';
import ChatMessageDao from '@shared/dao/ChatMessageDao';

/**
 * @param {object} param0
 * @param {string} param0.chatId
 * @param {string} param0.from
 * @param {string} param0.to
 * @param {string} param0.message
 */
export const create = async ({
  chatId,
  from,
  to,
  message,
}) => {
  const params = {
    chatId,
    from,
    to,
    message,
  };

  checkParameters(params);

  return run(params);
};

export const run = async ({
  chatId,
  from,
  to,
  message,
}) => {
  try {
    const now = new Date().toISOString();

    const newChatMessage = {
      chatId,
      from,
      to,
      message,
      messageId: uuid(),
      read: false,
      createdAt: now,
      updatedAt: now,
    };

    const newMessage = await new ChatMessageDao().create({ chatMessage: newChatMessage });

    return { message: newMessage };
  } catch (err) {
    console.log('Error CreateChat Run', err);
    console.log('Params: ', {
      chatId,
      from,
      to,
      message,
    });
    throw err;
  }
};

const checkParameters = ({
  chatId,
  from,
  to,
  message,
}) => {
  const errors = {};

  if (!chatId) errors.chatId = 'undefined';
  if (!from) errors.from = 'undefined';
  if (!to) errors.to = 'undefined';
  if (!message) errors.message = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default create;
