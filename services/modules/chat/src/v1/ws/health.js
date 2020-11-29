import ApiGateway from '@/lib/connectors/ApiGateway';
import env from '@root/ms.env';
import { lambdaResp } from '@shared/utils/utils';

export const run = async event => {
  const { requestContext: { connectionId } } = event;

  await new ApiGateway().generateSocketMessage({
    connectionId,
    data: JSON.stringify({ message: 'PONG' }),
  });

  return lambdaResp(env.STATUS_SUCCESS);
};

export default { run };
