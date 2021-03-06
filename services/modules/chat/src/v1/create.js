import { getBody } from 'aws-lambda-utils-js';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { create } from '@/lib/createChat';
import env from '@root/ms.env';

const getParameters = ({ evt }) => {
  const body = getBody(evt);

  return {
    participant1: body?.participant1,
    participant2: body?.participant2,
  };
};

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });

    const { created, ...data } = await create(parameters);

    return lambdaResp(
      created
        ? env.STATUS_CREATED
        : env.STATUS_SUCCESS,
      data,
    );
  } catch (err) {
    return lambdaRespErr(err);
  }
};

export default { run };
