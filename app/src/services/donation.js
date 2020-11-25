import axios from 'axios';
import store from '@/store';

export const create = async donation => {
  const res = await axios.post(`${process.env.VUE_APP_DONATION_ENDPOINT}/v1/${store.state.auth.user.email}/donations`, {
    ...donation,
  });

  if (res.status === 201) return res.data;
};
