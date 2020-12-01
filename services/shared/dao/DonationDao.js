const GenericDao = require('./GenericDao');
const { error } = require('../utils/utils');
const env = require('../ms.env');

const TABLE_NAME = 'FG.Donation';

module.exports = class DonationDao extends GenericDao {
  get({ userEmail, donationId, fields = [] } = {}) {
    return this._get({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail, donationId,
        },
      },
      fields,
    });
  }

  scan({ fields = [] } = {}) {
    return this._scan({
      params: {
        TableName: TABLE_NAME,
      },
      fields,
    });
  }

  query({ userEmail, fields = [] } = {}) {
    return this._query({
      params: {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userEmail = :userEmail',
        ExpressionAttributeValues: {
          ':userEmail': userEmail,
        },
      },
      fields,
    });
  }

  delete({ userEmail, donationId } = {}) {
    return this._.delete({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail, donationId,
        },
      },
    });
  }

  async create({ donation = {} } = {}) {
    try {
      await this._put({
        params: {
          TableName: TABLE_NAME,
          Item: donation,
          ConditionExpression: 'attribute_not_exists(userEmail) and attribute_not_exists(donationId)',
        },
      });
    } catch (err) {
      if (err && err.code === 'ConditionalCheckFailedException') throw error(env.STATUS_CONFLICT, 'Doação já cadastrada');

      throw error(env.STATUS_ERROR, err.message);
    }

    return donation;
  }

  async put({ donation } = {}) {
    await this._put({
      params: {
        TableName: TABLE_NAME,
        Item: donation,
      },
    });

    return donation;
  }

  async updateDirectedTo({ userEmail, donationId, newNecessity }) {
    const { Attributes } = await this._update({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail,
          donationId,
        },
        ConditionExpression: 'attribute_exists(userEmail) AND attribute_exists(donationId)',
        UpdateExpression: 'SET #directedTo = list_append(if_not_exists(#directedTo, :empty_list), :directedTo)',
        ExpressionAttributeNames: {
          '#directedTo': 'directedTo',
        },
        ExpressionAttributeValues: {
          ':directedTo': [newNecessity],
          ':empty_list': [],
        },
        ReturnValues: 'UPDATED_NEW',
      },
    });

    return Attributes;
  }

  updateControlFields({ userEmail, donationId }) {
    return this._updateControlFields({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail,
          donationId,
        },
        ConditionExpression: 'attribute_exists(userEmail) AND attribute_exists(donationId)',
      },
    });
  }

  async updateStatus({ userEmail, donationId, finished }) {
    const { Attributes } = await this._update({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail,
          donationId,
        },
        ConditionExpression: 'attribute_exists(userEmail) AND attribute_exists(donationId)',
        UpdateExpression: 'SET #finished = :finished',
        ExpressionAttributeNames: {
          '#finished': 'finished',
        },
        ExpressionAttributeValues: {
          ':finished': finished,
        },
        ReturnValues: 'UPDATED_NEW',
      },
    });

    return Attributes;
  }
};
