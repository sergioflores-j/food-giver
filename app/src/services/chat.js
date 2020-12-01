import axios from 'axios';
import store from '@/store';

export const listByUserEmail = async () => {
  const res = await axios.get(`${process.env.VUE_APP_CHAT_ENDPOINT}/v1/users/${store.state.auth.user.email}/chats`);

  if (res.status === 200) return res.data;
};

export const create = async ({ participant1, participant2 }) => {
  const res = await axios.post(`${process.env.VUE_APP_CHAT_ENDPOINT}/v1/chats`, {
    participant1, participant2,
  });

  if (res.status === 201 || res.status === 200) return res.data;
};

export const get = async chatId => {
  const res = await axios.get(`${process.env.VUE_APP_CHAT_ENDPOINT}/v1/chats/${chatId}`);

  if (res.status === 200) return res.data;
};

export const getMessages = async chatId => {
  const res = await axios.get(`${process.env.VUE_APP_CHAT_ENDPOINT}/v1/chats/${chatId}/messages`);

  if (res.status === 200) return res.data;
};

export const createMessage = async (chatId, { from, to, message }) => {
  const res = await axios.post(`${process.env.VUE_APP_CHAT_ENDPOINT}/v1/chats/${chatId}/messages`, {
    from, to, message,
  });

  if (res.status === 201) return res.data;
};
