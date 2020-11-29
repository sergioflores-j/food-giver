import commonEnv from '@shared/ms.env';

export default {
  ...commonEnv,
  WEBSOCKET_API_ENDPOINT: process.env.IS_OFFLINE
    ? process.env.LOCAL_WEBSOCKET_API_ENDPOINT
    : process.env.WEBSOCKET_API_ENDPOINT,
};
