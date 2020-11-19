import axios from 'axios';

export default class UserService {
  static async create(user) {
    const data = await axios.post(process.env.VUE_APP_USER_ENDPOINT, user);

    if (data.status === 201) return { success: true };
  }

  static async checkExistentUser(email) {
    const res = await axios.get(
      `${process.env.VUE_APP_USER_ENDPOINT}/${encodeURIComponent(email)}/check`,
    );

    if (res.status === 200) return res.data;
  }
}
