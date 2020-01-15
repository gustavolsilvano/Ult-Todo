import axios from 'axios';
import { env } from '../constants/constants';

export default axios.create({
  timeout: 3000,
  baseURL:
    env === 'dev'
      ? 'http://10.0.2.2:3000/api/v1'
      : 'https://ultimate-todo.herokuapp.com'
});
