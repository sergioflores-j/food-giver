import { getBody } from 'aws-lambda-utils-js';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { create } from '@/lib/createUser';
import env from '@root/ms.env';

const getParameters = ({ evt }) => ({
  user: getBody(evt),
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
