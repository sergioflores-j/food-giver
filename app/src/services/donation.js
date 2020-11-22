import axios from 'axios';

export const create = async donation => {
  const res = await axios.post(process.env.VUE_APP_DONATION_ENDPOINT, donation);

  if (res.status === 201) return res.data;
};
