import axios from 'axios';
import store from '@/store';

export const create = async necessity => {
  const res = await axios.post(`${process.env.VUE_APP_NECESSITY_ENDPOINT}/v1/${store.state.auth.user.email}/necessities`, {
    ...necessity,
  });

  if (res.status === 201) return res.data;
};

export const selectDonation = async (necessityId, { donationId, userEmail }) => {
  const res = await axios
    .post(`${process.env.VUE_APP_NECESSITY_ENDPOINT}/v1/${store.state.auth.user.email}/necessities/${necessityId}/donations`, {
      donationId, userEmail,
    });

  if (res.status === 200) return res.data;
};

export const listByUserEmail = async ({ showFinished = true } = {}) => {
  const res = await axios.get(`${process.env.VUE_APP_NECESSITY_ENDPOINT}/v1/${store.state.auth.user.email}/necessities`, {
    params: {
      showFinished,
    },
  });

  if (res.status === 200) return res.data;
};
