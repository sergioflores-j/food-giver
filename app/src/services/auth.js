import axios from 'axios';

export const login = async ({ email, password }) => {
  const { status, data } = await axios.post(`${process.env.VUE_APP_AUTH_ENDPOINT}/login`, { email, password });

  if (status === 200) return data;
};
