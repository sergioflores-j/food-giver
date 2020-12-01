import { getBody } from 'aws-lambda-utils-js';
import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { changeStatus } from '@/lib/changeStatusDonation';
import env from '@root/ms.env';

const getParameters = ({ evt }) => ({
  donationId: evt.pathParameters.donationId,
  finished: getBody(evt).finished,
  userEmail: decodeURIComponent(evt.pathParameters.userEmail),
});

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });
    console.log('parameters', parameters);

    const data = await changeStatus(parameters);

    return lambdaResp(env.STATUS_SUCCESS, data);
  } catch (err) {
    return lambdaRespErr(err);
  }
};

export default { run };
