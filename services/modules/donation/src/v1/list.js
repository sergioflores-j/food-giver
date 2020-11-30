import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { list as listByUser } from '@/lib/listDonationsByUser';
import { list } from '@/lib/listDonations';
import env from '@root/ms.env';

const getParameters = ({ evt }) => ({
  userEmail: decodeURIComponent(evt.pathParameters?.userEmail || ''),
  sessionUser: evt.requestContext?.authorizer?.principalId,
});

export const run = async event => {
  try {
    const parameters = getParameters({ evt: event });

    let data = {};

    if (parameters.userEmail)
      data = await listByUser(parameters);
    else data = await list(parameters);

    return lambdaResp(env.STATUS_SUCCESS, data);
  } catch (err) {
    return lambdaRespErr(err);
  }
};

export default { run };
