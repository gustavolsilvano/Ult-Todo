import axios from 'axios';

export default axios.create({
  timeout: 3000,
  baseURL: 'http://10.0.2.2:3000/api/v1'
});
