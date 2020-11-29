import aws from 'aws-sdk';
import env from '@root/ms.env';

export default class ApiGateway {
  constructor() {
    const CONNECTOR_OPTS = {
      endpoint: env.WEBSOCKET_API_ENDPOINT,
    };

    console.log('CONNECTOR_OPTS', CONNECTOR_OPTS);

    this._connector = new aws.ApiGatewayManagementApi(CONNECTOR_OPTS);
  }

  get connector() {
    return this._connector;
  }

  async generateSocketMessage({ connectionId, data } = {}) {
    try {
      return await this._connector.postToConnection({
        ConnectionId: connectionId,
        Data: data,
      }).promise();
    } catch (error) {
      if (error.statusCode === 410) {
        console.log(`Stale connection ${connectionId}`);
        return { status: '#stale_connection', connectionId };
      }
      console.error('Unable to generate socket message', error);
    }
  }
}
