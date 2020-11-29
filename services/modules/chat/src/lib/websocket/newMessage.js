// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';
import ChatDao from '@shared/dao/ChatDao';
import { findByConnectionId, findByEmail } from '@/lib/utils/findActiveParticipant';
import { create as createMessage } from '@/lib/createMessage';
import sendMessage from '@/lib/utils/sendMessage';
import { getOtherParticipantEmail } from '@/lib/utils/chatParticipant';

/**
 * @param {object} param0
 * @param {string} param0.connectionId
 * @param {string} param0.message
 */
export const newMessage = async ({
  connectionId,
  message,
}) => {
  const params = {
    connectionId,
    message,
  };

  checkParameters(params);

  return run(params);
};

export const run = async ({
  connectionId,
  message,
}) => {
  try {
    const [chat] = await new ChatDao().queryByConnectionId({ connectionId });

    if (!chat) throw error(env.STATUS_NOTFOUND, 'chat not found');

    const { participant: userEmail } = findByConnectionId({
      connectionId,
      activeSocket: chat.activeSocket,
    });

    const { otherParticipant } = findByEmail({
      userEmail,
      activeSocket: chat.activeSocket,
    });

    const { message: createdMessage } = await createMessage({
      chatId: chat.chatId,
      from: userEmail,
      message,
      // ? If the other participant is currently active get it's email, otherwise find in the chat object
      to: otherParticipant
        ? otherParticipant.userEmail
        : getOtherParticipantEmail({ chat, userEmail }),
    });

    const notificationBody = {
      chatId: chat.chatId,
      event: 'newMessage',
      message,
      messageData: createdMessage,
    };

    console.log('is sending message', notificationBody);

    // ? Send the created message for both users
    await Promise.all([
      sendMessage({
        ...notificationBody,
        connectionId,
        participant: userEmail,
      }),
      ...(
        otherParticipant ? [
          sendMessage({
            ...notificationBody,
            connectionId: otherParticipant.connectionId,
            participant: otherParticipant.userEmail,
          }),
        ] : []
      ),
    ]);
  } catch (err) {
    console.log('Error NewMessage Run', err);
    console.log('Params: ', {
      connectionId,
      message,
    });
    throw err;
  }
};

const checkParameters = ({
  connectionId,
  message,
}) => {
  const errors = {};

  if (!connectionId) errors.connectionId = 'undefined';
  if (!message) errors.message = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default newMessage;
