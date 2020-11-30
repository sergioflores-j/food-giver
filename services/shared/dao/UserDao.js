const GenericDao = require('./GenericDao');
const { error } = require('../utils/utils');
const env = require('../ms.env');

const TABLE_NAME = 'FG.User'; // TODO: colocar em variavel de ambiente

module.exports = class UserDao extends GenericDao {
  async get({ email, fields = [], excludePassword = false } = {}) {
    const item = await this._get({
      params: {
        TableName: TABLE_NAME,
        Key: {
          email,
        },
      },
      fields,
    });

    if (excludePassword && item) {
      const { password, ...user } = item;
      return user;
    }

    return item;
  }

  delete({ email } = {}) {
    return this._.delete({
      params: {
        TableName: TABLE_NAME,
        Key: {
          email,
        },
      },
    });
  }

  async create({ user = {} } = {}) {
    try {
      await this._put({
        params: {
          TableName: TABLE_NAME,
          Item: user,
          ConditionExpression: 'attribute_not_exists(email)',
        },
      });
    } catch (err) {
      if (err && err.code === 'ConditionalCheckFailedException') throw error(env.STATUS_CONFLICT, 'Usuário já cadastrado');

      throw error(env.STATUS_ERROR, err.message);
    }

    return user;
  }

  async put({ user } = {}) {
    await this._put({
      params: {
        TableName: TABLE_NAME,
        Item: user,
      },
    });

    return user;
  }
};
