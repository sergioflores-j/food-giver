import { isString } from '@shared/utils/utils';
import env from '@root/ms.env';
import test from '@/lib/constants/test';

export const run = (evt, ctx, cb) => {
  console.log(isString(evt.headers));
  console.log(env.MESSAGE_FORBIDDEN);
  console.log(test);

  return cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      status: 'success',
      data: {},
    }),
  });
};

export default {
  run,
};
