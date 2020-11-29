// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import ChatDao from '@shared/dao/ChatDao';
import sendMessage from '@/lib/utils/sendMessage';
import { findByConnectionId, findByEmail } from '../utils/findActiveParticipant';

/**
 * @param {object} param0
 * @param {string} param0.chatId
 * @param {string} param0.userEmail
 * @param {string} param0.connectionId
 * @param {number} param0.connectedAt
 * @param {string} param0.action
 */
export const connectionHandler = async ({
  chatId,
  userEmail,
  connectionId,
  connectedAt,
  action,
}) => {
  const params = {
    chatId,
    userEmail,
    connectionId,
    connectedAt,
    action,
  };
  checkParameters(params);

  return run(params);
};

export const run = async ({
  chatId,
  userEmail,
  connectionId,
  connectedAt,
  action,
}) => {
  try {
    let chat;
    let otherParticipant;

    if (action === '$disconnect') {
      ({ otherParticipant, chat } = await disconnect({ connectionId }));
    } else {
      ({ otherParticipant, chat } = await connect({
        chatId,
        userEmail,
        connectionId,
        connectedAt,
      }));
    }

    await new ChatDao().updateControlFields({ chatId: chat.chatId });

    if (otherParticipant) {
      console.log('otherParticipant', otherParticipant);

      await notifyParticipant({
        action, otherParticipant, chatId: chat.chatId,
      });
    }

    console.log('success :D');

    return { chatId: chat.chatId };
  } catch (err) {
    console.log('Error connectionHandler Run', err);
    console.log('Params: ', {
      chatId,
      userEmail,
      connectionId,
      connectedAt,
      action,
    });
    throw err;
  }
};

const notifyParticipant = async ({
  action, otherParticipant, chatId,
}) => {
  const event = action === '$disconnect' ? 'disconnected' : 'connected';

  await sendMessage({
    chatId,
    connectionId: otherParticipant.connectionId,
    participant: otherParticipant.userEmail,
    event,
    message: `The user has ${event}.`,
    messageData: { connectionId: otherParticipant.connectionId },
  });
};

const disconnect = async ({ connectionId }) => {
  console.log('disconnecting:', connectionId);

  const [chat] = await new ChatDao().queryByConnectionId({ connectionId });
  const { participant, otherParticipant } = findByConnectionId({
    connectionId,
    activeSocket: chat.activeSocket,
  });

  // ? Set the participant as inactive (remove it's connection from the chat object)
  await new ChatDao().updateActiveParticipant({
    chatId: chat.chatId,
    participant,
  });

  console.log('disconnected successfully');

  return {
    chat,
    otherParticipant: chat.activeSocket[otherParticipant]
      ? { ...chat.activeSocket[otherParticipant], userEmail: otherParticipant }
      : undefined,
  };
};

const connect = async ({
  chatId,
  userEmail,
  connectionId,
  connectedAt,
}) => {
  console.log('connecting:', userEmail);

  const chat = await new ChatDao().get({ chatId });

  if (!chat) throw error(env.STATUS_NOTFOUND, 'Chat not found');

  await new ChatDao().updateActiveParticipant({
    chatId: chat.chatId,
    participant: userEmail,
    connectionId,
    connectedAt,
  });

  const { otherParticipant } = findByEmail({
    userEmail,
    activeSocket: chat.activeSocket,
  });

  console.log('connected successfully');

  return {
    chat,
    otherParticipant,
  };
};

const checkParameters = params => {
  const errors = {};

  if (!params.connectionId) errors.connectionId = 'undefined';
  if (!params.connectedAt) errors.connectedAt = 'undefined';

  if (params.action === '$disconnect') return;

  if (!params.chatId) errors.chatId = 'undefined';
  if (!params.userEmail) errors.userEmail = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default connectionHandler;
