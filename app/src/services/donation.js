import axios from 'axios';
import store from '@/store';

export const create = async donation => {
  const res = await axios.post(`${process.env.VUE_APP_DONATION_ENDPOINT}/v1/users/${store.state.auth.user.email}/donations`, {
    ...donation,
  });

  if (res.status === 201) return res.data;
};

export const listByUserEmail = async () => {
  const res = await axios.get(`${process.env.VUE_APP_DONATION_ENDPOINT}/v1/users/${store.state.auth.user.email}/donations`);

  if (res.status === 200) return res.data;
};

export const list = async () => {
  const res = await axios.get(`${process.env.VUE_APP_DONATION_ENDPOINT}/v1/donations`);

  if (res.status === 200) return res.data;
};

export const get = async (userEmail, donationId) => {
  const res = await axios.get(`${process.env.VUE_APP_DONATION_ENDPOINT}/v1/users/${userEmail}/donations/${donationId}`);

  if (res.status === 200) return res.data;
};
