const GenericDao = require('./GenericDao');
const { error } = require('../utils/utils');
const env = require('../ms.env');

const TABLE_NAME = 'FG.ChatMessage';

module.exports = class ChatMessageDao extends GenericDao {
  /**
   * @returns {import('../../../types/ChatMessage').ChatMessage}
   */
  get({ chatId, messageId, fields = [] } = {}) {
    return this._get({
      params: {
        TableName: TABLE_NAME,
        Key: {
          chatId, messageId,
        },
      },
      fields,
    });
  }

  /**
   * @returns {Array<import('../../../types/ChatMessage').ChatMessage>}
   */
  async queryByChatId({ chatId, fields = [] } = {}) {
    return this._query({
      params: {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'chatId = :chatId',
        ExpressionAttributeValues: {
          ':chatId': chatId,
        },
      },
      fields,
    });
  }

  delete({ chatId, messageId } = {}) {
    return this._.delete({
      params: {
        TableName: TABLE_NAME,
        Key: {
          chatId, messageId,
        },
      },
    });
  }

  /**
   * @param {object} param0
   * @param {import('../../../types/ChatMessage').ChatMessage} param0.chatMessage
   */
  async create({ chatMessage = {} } = {}) {
    try {
      await this._put({
        params: {
          TableName: TABLE_NAME,
          Item: chatMessage,
          ConditionExpression: 'attribute_not_exists(chatId) and attribute_not_exists(messageId)',
        },
      });
    } catch (err) {
      if (err && err.code === 'ConditionalCheckFailedException') throw error(env.STATUS_CONFLICT, 'Mensagem já cadastrada');

      throw error(env.STATUS_ERROR, err.message);
    }

    return chatMessage;
  }

  /**
   * @param {object} param0
   * @param {import('../../../types/ChatMessage').ChatMessage} param0.chatMessage
   */
  async put({ chatMessage } = {}) {
    await this._put({
      params: {
        TableName: TABLE_NAME,
        Item: chatMessage,
      },
    });

    return chatMessage;
  }

  // async updateControlFields({ chatId }) {
  //   const { Attributes } = await this._update({
  //     params: {
  //       TableName: TABLE_NAME,
  //       Key: {
  //         chatId,
  //       },
  //       UpdateExpression: 'SET #updatedAt = :updatedAt',
  //       ExpressionAttributeValues: {
  //         ':updatedAt': new Date().toISOString(),
  //       },
  //       ExpressionAttributeNames: {
  //         '#updatedAt': 'updatedAt',
  //       },
  //       ConditionExpression: 'attribute_exists(chatId)',
  //       ReturnValues: 'UPDATED_NEW',
  //     },
  //   });

  //   return Attributes;
  // }
};
