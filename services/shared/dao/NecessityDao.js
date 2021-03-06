const GenericDao = require('./GenericDao');
const { error } = require('../utils/utils');
const env = require('../ms.env');

const TABLE_NAME = 'FG.Necessity';

module.exports = class Necessity extends GenericDao {
  get({ userEmail, necessityId, fields = [] } = {}) {
    return this._get({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail, necessityId,
        },
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

  delete({ userEmail, necessityId } = {}) {
    return this._.delete({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail, necessityId,
        },
      },
    });
  }

  async create({ necessity = {} } = {}) {
    try {
      await this._put({
        params: {
          TableName: TABLE_NAME,
          Item: necessity,
          ConditionExpression: 'attribute_not_exists(userEmail) and attribute_not_exists(necessityId)',
        },
      });
    } catch (err) {
      if (err && err.code === 'ConditionalCheckFailedException') throw error(env.STATUS_CONFLICT, 'Necessidade já cadastrada');

      throw error(env.STATUS_ERROR, err.message);
    }

    return necessity;
  }

  async put({ necessity } = {}) {
    await this._put({
      params: {
        TableName: TABLE_NAME,
        Item: necessity,
      },
    });

    return necessity;
  }

  async updateDonations({ userEmail, necessityId, newDonation }) {
    const { Attributes } = await this._update({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail,
          necessityId,
        },
        ConditionExpression: 'attribute_exists(userEmail) AND attribute_exists(necessityId)',
        UpdateExpression: 'SET #donations = list_append(if_not_exists(#donations, :empty_list), :donations)',
        ExpressionAttributeNames: {
          '#donations': 'donations',
        },
        ExpressionAttributeValues: {
          ':donations': [newDonation],
          ':empty_list': [],
        },
        ReturnValues: 'UPDATED_NEW',
      },
    });

    return Attributes;
  }

  updateControlFields({ userEmail, necessityId }) {
    return this._updateControlFields({
      params: {
        TableName: TABLE_NAME,
        Key: {
          userEmail,
          necessityId,
        },
        ConditionExpression: 'attribute_exists(userEmail) AND attribute_exists(necessityId)',
      },
    });
  }
};
