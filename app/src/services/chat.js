import axios from 'axios';
import store from '@/store';

export const listByUserEmail = async () => {
  const res = await axios.get(`${process.env.VUE_APP_CHAT_ENDPOINT}/v1/users/${store.state.auth.user.email}/chats`);

  if (res.status === 200) return res.data;
};

export const get = async chatId => {
  const res = await axios.get(`${process.env.VUE_APP_CHAT_ENDPOINT}/v1/chats/${chatId}`);

  if (res.status === 200) return res.data;
};
