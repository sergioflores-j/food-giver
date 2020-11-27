const dbClient = require('aws-dynamodb-factory-js');
const { error } = require('../utils/utils');
const { mountProjectionExpression } = require('../utils/dynamo');

module.exports = class GenericDao {
  constructor() {
    this.db = dbClient.doc({
      options: process.env.IS_OFFLINE ? undefined : { region: 'us-east-1' },
    });
  }

  async _get({
    params,
    fields = [],
  } = {}) {
    try {
      const { Item } = await this.db.get({
        ...params,
        ...mountProjectionExpression({ fields, options: params }),
      }).promise();

      return Item;
    } catch (err) {
      throw err;
    }
  }

  _put({ params = {} } = {}) {
    return this.db.put(params).promise();
  }

  async _query({
    params, fields = [], _items = [], stopOnLimit = false,
  } = {}) {
    try {
      const { Items, LastEvaluatedKey } = await this.db.query({
        ...params,
        ...mountProjectionExpression({ fields, options: params }),
      }).promise();

      const newItemsList = (Array.isArray(Items) && Items.length > 0)
        ? _items.concat(Items)
        : _items;

      if (stopOnLimit && params.Limit && newItemsList.length >= params.Limit) return newItemsList;

      if (LastEvaluatedKey) {
        return this._query({
          fields,
          params: {
            ...params,
            ExclusiveStartKey: LastEvaluatedKey,
          },
          _items: newItemsList,
        });
      }

      return newItemsList;
    } catch (err) {
      throw err;
    }
  }

  async _getAll({ params, list, fields = [] } = {}) {
    let idx = 0;
    // ? Empacota de 25 requests por vez (limite do batchGet)
    const packs = list.reduce((acc, param) => {
      if (acc[idx] && acc[idx].length >= 25) idx++;

      if (!acc[idx]) acc[idx] = [];

      acc[idx].push({ ...param });

      return acc;
    }, []);

    const data = await Promise.all(packs.map(keys => {
      const opts = {
        RequestItems: {
          [params.TableName]: {
            Keys: keys,
            ...mountProjectionExpression({ fields }),
          },
        },
      };

      return this.db.batchGet(opts)
        .promise()
        .then(({ Responses }) => Responses[params.TableName]);
    }));

    return data.reduce((acc, i) => acc.concat(i), []);
  }

  async _delete({ params = {} } = {}) {
    try {
      await this.db.delete(params).promise();

      return params.Key;
    } catch (err) {
      throw error(500, err.message);
    }
  }

  async _update({ params = {} } = {}) {
    try {
      await this.db.update(params).promise();
    } catch (err) {
      throw error(500, err.message);
    }
  }

  _deleteAll(params = []) {
    return Promise.all(
      params.map(param => this._delete({
        params: param,
      })),
    );
  }
};
