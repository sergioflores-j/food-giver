import axios from 'axios';

export const create = async user => {
  const res = await axios.post(process.env.VUE_APP_USER_ENDPOINT, user);

  if (res.status === 201) return res.data;
};

export const get = async email => {
  const res = await axios.get(`${process.env.VUE_APP_USER_ENDPOINT}/${encodeURIComponent(email)}`);

  if (res.status === 200) return res.data;
};

export const checkExistentUser = async email => {
  const res = await axios.get(
    `${process.env.VUE_APP_USER_ENDPOINT}/${encodeURIComponent(email)}/check`,
  );

  if (res.status === 200) return res.data;
};
