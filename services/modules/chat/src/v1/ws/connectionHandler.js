import { get } from 'deep-object-js';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import env from '@root/ms.env';
import { connectionHandler } from '@/lib/websocket/connectionHandler';

const getParameters = ({ evt }) => ({
  chatId: get(evt, 'queryStringParameters.chatId'),
  userEmail: get(evt, 'queryStringParameters.userEmail'), // ? maybe pegar da session :D
  connectionId: get(evt, 'requestContext.connectionId'),
  connectedAt: get(evt, 'requestContext.connectedAt'),
  action: get(evt, 'requestContext.routeKey'),
});

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });

    const data = await connectionHandler(parameters);

    return lambdaResp(env.STATUS_SUCCESS, data);
  } catch (err) {
    console.error('error connectionHandler', err);
    return lambdaRespErr(err);
  }
};

export default { run };
