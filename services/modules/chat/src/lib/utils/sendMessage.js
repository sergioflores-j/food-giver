import { get } from 'deep-object-js';
import ApiGateway from '@/lib/connectors/ApiGateway';
import ChatDao from '@shared/dao/ChatDao';

/**
 * @param {object} param0
 * @param {string} param0.chatId
 * @param {string} param0.participant
 * @param {string} param0.connectionId
 * @param {string} param0.event
 * @param {string} param0.message
 * @param {Object} [param0.messageData]
 */
export default async function sendMessage({
  chatId,
  participant,
  connectionId,
  event,
  message,
  messageData = {},
}) {
  if (!connectionId) return;

  return new ApiGateway().generateSocketMessage({
    connectionId,
    data: JSON.stringify({
      event,
      message,
      ...messageData,
    }),
  })
    .then(async res => {
      if (get(res, 'status') === '#stale_connection')
        await new ChatDao().removeSocket({ chatId, participant });
    });
}
