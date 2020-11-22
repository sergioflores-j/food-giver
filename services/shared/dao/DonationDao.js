const dbClient = require('aws-dynamodb-factory-js');
const GenericDao = require('./GenericDao');
const { error } = require('../utils/utils');
const env = require('../ms.env');

const TABLE_NAME = 'FG.Donation';

module.exports = class DonationDao extends GenericDao {
  constructor() {
    super();
    this.db = dbClient.doc();
  }

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
};
