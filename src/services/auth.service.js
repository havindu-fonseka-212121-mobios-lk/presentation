import axios from 'axios';

class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_BASE_URL;
  }

  async signIn(email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/auth/signin`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
