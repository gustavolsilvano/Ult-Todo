import { Dimensions } from 'react-native';

const windowDimension = prop => {
  const { width, height } = Dimensions.get('window');

  switch (prop) {
    case 'width':
      return width;

    case 'height':
      return height;

    default:
      break;
  }
};

const width = windowDimension('width');
const height = windowDimension('height');

const logo = require('../../resource/logo.png');
const logoStye = { width: 100, height: 100 };

const delay = 3 * 60 * 1000;

const borderRadiusConf = 20;

const backgroundColor = '#202125';

const cardColorConf = '#f4511e';

const textColor = 'white';

const profilePlaceHolder = require('../../resource/profilePlaceholder.jpg');

// const env = 'prod';
const env = 'dev';

const baseURL =
  env === 'dev'
    ? 'http://10.0.2.2:3000'
    : 'https://ultimate-todo.herokuapp.com';

const imageURL = 'img/user';

export {
  delay,
  borderRadiusConf,
  width,
  height,
  backgroundColor,
  cardColorConf,
  logo,
  logoStye,
  textColor,
  profilePlaceHolder,
  env,
  baseURL,
  imageURL
};
