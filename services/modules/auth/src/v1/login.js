import { getBody } from 'aws-lambda-utils-js';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import login from '@/lib/login';
import env from '@root/ms.env';

const getParameters = ({ evt }) => {
  const body = getBody(evt) || {};

  return {
    email: body.email,
    password: body.password,
  };
};

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });

    // Authenticate user
    const { user, token } = await login(parameters);

    return lambdaResp(env.STATUS_SUCCESS, { user, token });
  } catch (err) {
    return lambdaRespErr(err);
  }
};

export default { run };
