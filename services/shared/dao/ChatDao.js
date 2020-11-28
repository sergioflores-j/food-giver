const GenericDao = require('./GenericDao');
const { error } = require('../utils/utils');
const env = require('../ms.env');

const TABLE_NAME = 'FG.Chat';
const PARTICIPANT1_INDEX_NAME = 'participant1_index';
const PARTICIPANT2_INDEX_NAME = 'participant2_index';
const CONNECTIONID1_INDEX_NAME = 'connectionId1_index';
const CONNECTIONID2_INDEX_NAME = 'connectionId2_index';

module.exports = class ChatDao extends GenericDao {
  /**
   * @returns {import('../../../types/Chat').Chat} chat
   */
  get({ chatId, fields = [] } = {}) {
    return this._get({
      params: {
        TableName: TABLE_NAME,
        Key: {
          chatId,
        },
      },
      fields,
    });
  }

  async list({ userEmail, fields = [] } = {}) {
    const res = await Promise.all([
      this._query({
        params: {
          TableName: TABLE_NAME,
          IndexName: PARTICIPANT1_INDEX_NAME,
          KeyConditionExpression: 'participant1 = :participant1',
          ExpressionAttributeValues: {
            ':participant1': userEmail,
          },
        },
        fields,
      }),
      this._query({
        params: {
          TableName: TABLE_NAME,
          IndexName: PARTICIPANT2_INDEX_NAME,
          KeyConditionExpression: 'participant2 = :participant2',
          ExpressionAttributeValues: {
            ':participant2': userEmail,
          },
        },
        fields,
      }),
    ]);

    return res.flat();
  }

  async query({ participant1, participant2, fields = [] } = {}) {
    const items = await this._query({
      params: {
        TableName: TABLE_NAME,
        IndexName: PARTICIPANT1_INDEX_NAME,
        KeyConditionExpression: 'participant1 = :participant1 AND participant2 = :participant2',
        ExpressionAttributeValues: {
          ':participant1': participant1,
          ':participant2': participant2,
        },
      },
      fields,
    });

    if (items.length) return items;

    // ? Search by the inverse attribute order
    const items2 = await this._query({
      params: {
        TableName: TABLE_NAME,
        IndexName: PARTICIPANT1_INDEX_NAME,
        KeyConditionExpression: 'participant1 = :participant1 AND participant2 = :participant2',
        ExpressionAttributeValues: {
          ':participant1': participant2,
          ':participant2': participant1,
        },
      },
      fields,
    });

    return items2;
  }

  async queryByConnectionId({ connectionId, fields = [] } = {}) {
    const items = await this._query({
      params: {
        TableName: TABLE_NAME,
        IndexName: CONNECTIONID1_INDEX_NAME,
        KeyConditionExpression: 'connectionId1 = :connectionId1',
        ExpressionAttributeValues: {
          ':connectionId1': connectionId,
        },
      },
      fields,
    });

    if (items.length) return items;

    // ? Search by the second connectionId
    const items2 = await this._query({
      params: {
        TableName: TABLE_NAME,
        IndexName: CONNECTIONID2_INDEX_NAME,
        KeyConditionExpression: 'connectionId2 = :connectionId2',
        ExpressionAttributeValues: {
          ':connectionId2': connectionId,
        },
      },
      fields,
    });

    return items2;
  }

  delete({ chatId } = {}) {
    return this._.delete({
      params: {
        TableName: TABLE_NAME,
        Key: {
          chatId,
        },
      },
    });
  }

  /**
   * @param {object} param0
   * @param {import('../../../types/Chat').Chat} param0.chat
   */
  async create({ chat = {} } = {}) {
    try {
      await this._put({
        params: {
          TableName: TABLE_NAME,
          Item: chat,
          ConditionExpression: 'attribute_not_exists(chatId)',
        },
      });
    } catch (err) {
      if (err && err.code === 'ConditionalCheckFailedException') throw error(env.STATUS_CONFLICT, 'Chat já cadastrado');

      throw error(env.STATUS_ERROR, err.message);
    }

    return chat;
  }

  /**
   * @param {object} param0
   * @param {import('../../../types/Chat').Chat} param0.chat
   */
  async put({ chat } = {}) {
    await this._put({
      params: {
        TableName: TABLE_NAME,
        Item: chat,
      },
    });

    return chat;
  }

  async updateActiveParticipant({
    chatId, participant, connectionId = '', connectedAt = '',
  }) {
    if (!connectionId) return this.removeSocket({ chatId, participant });

    const existentChat = await this.get({ chatId, fields: ['participant1'] });
    if (!existentChat) throw error(env.MESSAGE_NOTFOUND);

    return this._update({
      params: {
        TableName: TABLE_NAME,
        Key: {
          chatId,
        },
        UpdateExpression: 'SET #activeSocket.#participant = :activeSocket, #connectionId = :connectionId',
        ExpressionAttributeValues: {
          ':connectionId': connectionId,
          ':activeSocket': {
            connectionId,
            connectedAt,
          },
        },
        ExpressionAttributeNames: {
          '#activeSocket': 'activeSocket',
          '#connectionId': `connectionId${participant === existentChat.participant1 ? '1' : '2'}`, // ? Index :D
          '#participant': participant,
        },
      },
    });
  }

  async removeSocket({
    chatId, participant,
  }) {
    const existentChat = await this.get({ chatId, fields: ['participant1'] });

    if (!existentChat) throw error(env.MESSAGE_NOTFOUND);

    console.log('REMOVE SOCKET - chatId, participant,', chatId, participant);

    return this._update({
      params: {
        TableName: TABLE_NAME,
        Key: {
          chatId,
        },
        UpdateExpression: 'REMOVE #activeSocket.#participant, #connectionId',
        ExpressionAttributeNames: {
          '#activeSocket': 'activeSocket',
          '#connectionId': `connectionId${participant === existentChat.participant1 ? '1' : '2'}`, // ? Index :D
          '#participant': participant,
        },
      },
    });
  }

  async updateControlFields({ chatId }) {
    return this._update({
      params: {
        TableName: TABLE_NAME,
        Key: {
          chatId,
        },
        UpdateExpression: 'SET #updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':updatedAt': new Date().toISOString(),
        },
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt',
        },
        ConditionExpression: 'attribute_exists(chatId)',
      },
    });
  }
};
