import { lambdaResp, lambdaRespErr } from '@shared/utils/utils';
import { get } from '@/lib/getChat';
import env from '@root/ms.env';

const getParameters = ({ evt }) => ({
  chatId: evt.pathParameters.chatId,
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
