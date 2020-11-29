import { isString } from '@shared/utils/utils';
import env from '@root/ms.env';

export const run = (evt, ctx, cb) => {
  console.log(isString(evt.headers));
  console.log(env.MESSAGE_FORBIDDEN);

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
