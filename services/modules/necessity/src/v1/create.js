import { getBody } from 'aws-lambda-utils-js';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { create } from '@/lib/createNecessity';
import env from '@root/ms.env';

const getParameters = ({ evt }) => ({
  necessity: getBody(evt),
  userEmail: decodeURIComponent(evt.pathParameters.userEmail),
});

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });

    const data = await create(parameters);

    return lambdaResp(env.STATUS_CREATED, data);
  } catch (err) {
    return lambdaRespErr(err);
  }
};

export default { run };
