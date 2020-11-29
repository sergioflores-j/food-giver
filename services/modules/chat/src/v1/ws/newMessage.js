import env from '@root/ms.env';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { getBody } from 'aws-lambda-utils-js';
import { newMessage } from '@/lib/websocket/newMessage';

const getParameters = event => {
  const { requestContext: { connectionId } } = event;
  const { data } = getBody(event);

  return {
    connectionId,
    message: data?.message,
  };
};

export const run = async event => {
  try {
    const params = getParameters(event);

    console.log('params', params);

    await newMessage(params);

    return lambdaResp(env.STATUS_SUCCESS, { success: true });
  } catch (err) {
    console.error('error newMessage', err);
    return lambdaRespErr(err);
  }
};

export default { run };
