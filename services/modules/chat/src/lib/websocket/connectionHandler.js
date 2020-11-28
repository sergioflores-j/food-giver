// @ts-check
import { error } from '@shared/utils/utils';
import env from '@root/ms.env';

import ChatDao from '@shared/dao/ChatDao';
import sendMessage from '@/lib/utils/sendMessage';
import { createOrUpdateChat } from '@/lib/createOrUpdateChat';

/**
 * @param {object} param0
 * @param {string} param0.participant1
 * @param {string} param0.participant2
 * @param {string} param0.connectionId
 * @param {number} param0.connectedAt
 * @param {string} param0.action
 */
export const connectionHandler = async ({
  participant1,
  participant2,
  connectionId,
  connectedAt,
  action,
}) => {
  const params = {
    participant1,
    participant2,
    connectionId,
    connectedAt,
    action,
  };
  checkParameters(params);

  return run(params);
};

export const run = async ({
  participant1,
  participant2,
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
        participant1,
        participant2,
        connectionId,
        connectedAt,
      }));
    }

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
      participant1,
      participant2,
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
  });
};

const disconnect = async ({ connectionId }) => {
  console.log('disconnecting:', connectionId);

  const [chat] = await new ChatDao().queryByConnectionId({ connectionId });
  const activeSocketKeys = Object.keys(chat.activeSocket);

  console.log('activeSocketKeys', activeSocketKeys);

  // ? Find the participant who has this connectionId
  const participant = activeSocketKeys.find(k => chat.activeSocket[k].connectionId === connectionId);
  // ? Find the participant who doesn't has this connectionId
  const otherParticipant = activeSocketKeys.find(k => chat.activeSocket[k].connectionId !== connectionId);

  // ? Set the participant as inactive (remove it's connection from the chat object)
  await new ChatDao().updateActiveParticipant({
    chatId: chat.chatId,
    participant,
  });

  await new ChatDao().updateControlFields({ chatId: chat.chatId });

  console.log('disconnected successfully');

  return {
    chat,
    otherParticipant: chat.activeSocket[otherParticipant]
      ? { ...chat.activeSocket[otherParticipant], userEmail: otherParticipant }
      : undefined,
  };
};

const connect = async ({
  participant1,
  participant2,
  connectionId,
  connectedAt,
}) => {
  console.log('connecting:', participant1);

  const chat = await createOrUpdateChat({ participant1, participant2 });

  await new ChatDao().updateActiveParticipant({
    chatId: chat.chatId,
    participant: participant1,
    connectionId,
    connectedAt,
  });

  console.log('connected successfully');

  return {
    chat,
    otherParticipant: chat.activeSocket[participant2]
      ? { ...chat.activeSocket[participant2], userEmail: participant2 }
      : undefined,
  };
};

const checkParameters = params => {
  const errors = {};

  if (!params.connectionId) errors.connectionId = 'undefined';
  if (!params.connectedAt) errors.connectedAt = 'undefined';

  if (params.action === '$disconnect') return;

  if (!params.participant1) errors.participant1 = 'undefined';
  if (!params.participant2) errors.participant2 = 'undefined';

  if (Object.keys(errors).length) throw error(env.STATUS_BAD_REQUEST, errors);
};

export default connectionHandler;
