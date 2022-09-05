import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as RootNavigation from '../navigations/RootNavigation';

export const BASE_URL = 'https://api-dev-dnds.iconkaset.com';

axios.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token');
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async function (response) {
    return response;
  },
  async function (error) {
    /*  if (500 === error.response.status) {
        RootNavigation.navigate('Auth', {
          screen: 'InternalServerError',
        })
      }  */
    /*  if (401 === error.response.status) {
        RootNavigation.navigate('Auth', {
          screen: 'HomeScreen',
        })
      } */
    if (401 === error.response.status) {
      RootNavigation.navigate('Auth', {
        screen: 'HomeScreen',
      });
    }
    return Promise.reject(error);
  },
);

export const httpClient = axios;

const registerInstance = axios.create({});

registerInstance.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token_register');
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

const uploadFileregisterInstance = axios.create({})

uploadFileregisterInstance.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token_register');
  config.headers['Content-Type'] = 'multipart/form-data';
  config.headers['Authorization'] = `Bearer ${token}`;
  console.log(config);
  return config;
});

export const registerClient = registerInstance;
export const uploadFileClient = uploadFileregisterInstance;


