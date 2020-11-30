import { getBody } from 'aws-lambda-utils-js';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { select } from '@/lib/selectDonation';
import env from '@root/ms.env';

const getParameters = ({ evt }) => ({
  donation: getBody(evt),
  userEmail: decodeURIComponent(evt.pathParameters.userEmail),
  necessityId: decodeURIComponent(evt.pathParameters.necessityId),
});

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });

    const data = await select(parameters);

    return lambdaResp(env.STATUS_SUCCESS, data);
  } catch (err) {
    return lambdaRespErr(err);
  }
};

export default { run };
