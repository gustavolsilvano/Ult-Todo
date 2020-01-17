import axios from 'axios';
import { baseURL } from '../constants/constants';

export default axios.create({
  timeout: 3000,
  baseURL
});
