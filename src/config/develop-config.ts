import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as RootNavigation from '../navigations/RootNavigation';

export const BASE_URL = 'https://api-dnds-dev.iconkaset.com';
export const MIXPANEL_DEV = '7771b1854fb89d185debcd38023348d9';
export const MIXPANEL_PROD = '0bae055d89d622289e54453d6285c4cf';

axios.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token');
  const token_register = await AsyncStorage.getItem('token_register');
  if (!token) {
    config.headers.Authorization = `Bearer ${token_register}`;
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
    if (error.response.status === 401) {
      RootNavigation.navigate('Auth', {
        screen: 'HomeScreen',
      });
    }
    /* if (201 === error.response.status) {
      RootNavigation.navigate('Auth', {
        screen: 'HomeScreen',
      });
    } */
    return Promise.reject(error);
  },
);

export const httpClient = axios;

const registerInstance = axios.create({});

registerInstance.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token_register');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const uploadFileregisterInstance = axios.create({});

uploadFileregisterInstance.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token_register');
  config.headers['Content-Type'] = 'multipart/form-data';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const taskFormDataInstance = axios.create({});

taskFormDataInstance.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token');
  config.headers['Content-Type'] = 'multipart/form-data';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const uploadFileProfileInstance = axios.create({});

uploadFileProfileInstance.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('token');
  config.headers['Content-Type'] = 'multipart/form-data';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerClient = registerInstance;
export const uploadFileClient = uploadFileregisterInstance;
export const taskFormDataClient = taskFormDataInstance;
export const uploadFileProfile = uploadFileProfileInstance;
