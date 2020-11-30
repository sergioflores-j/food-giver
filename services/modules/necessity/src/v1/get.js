import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { get } from '@/lib/getNecessity';
import env from '@root/ms.env';

const getParameters = ({ evt }) => ({
  necessityId: decodeURIComponent(evt.pathParameters.necessityId),
  userEmail: decodeURIComponent(evt.pathParameters.userEmail),
});

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });

    const data = await get(parameters);

    return lambdaResp(env.STATUS_SUCCESS, data);
  } catch (err) {
    return lambdaRespErr(err);
  }
};

export default { run };
