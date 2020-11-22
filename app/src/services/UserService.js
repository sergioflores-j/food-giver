import axios from 'axios';

export default class UserService {
  static async create(user) {
    // TODO: colocar URL desfixada... em .env
    const data = await axios.post('http://localhost:3002/user', user);

    if (data.status === 201) return { success: true };
  }
}
