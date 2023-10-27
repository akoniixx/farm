import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  BASE_URL,
  httpClient,
  registerClient,
  uploadFileClient,
} from '../config/develop-config';
import { CommonActions } from '@react-navigation/native';
import { FCMtokenDatasource } from './FCMDatasource';

export class Authentication {
  static generateOtp(telNumber: String): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/farmer/request-login-otp', {
        telephoneNo: telNumber,
        refCode: telNumber,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async verifyOtp(payload: {
    telephoneNo: any;
    otpCode: string;
    token: any;
    refCode: any;
  }): Promise<any> {
    return httpClient
      .post(BASE_URL + '/auth/farmer/verify-otp', payload)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async generateOtpRegister(telNumber: String): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/farmer/request-register-otp', {
        telephoneNo: telNumber,
        // refCode: telNumber,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static login(
    telephoneNo: string,
    otpCode: string,
    token: string,
    refCode: string,
  ): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/farmer/verify-otp', {
        telephoneNo: telephoneNo,
        otpCode: otpCode,
        token: token,
        refCode: refCode,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async logout(navigation: any) {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');

    FCMtokenDatasource.deleteFCMtoken(fcmtoken!).then(async () => {
      const resetActionNavigate = CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'Auth',
            state: {
              routes: [
                {
                  name: 'HomeScreen',
                },
              ],
            },
          },
        ],
      });
      await AsyncStorage.multiRemove([
        'token',
        'farmer_id',
        'task_id',
        'fcmtoken',
      ]);
      navigation.popToTop();
      navigation.dispatch(resetActionNavigate);
    });
  }
  static generateOtpDelete(telNumber: String): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/farmer/request-delete-otp', {
        telephoneNo: telNumber,
        refCode: telNumber,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async onDeleteAccount(id: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + '/farmer/' + id)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
}
export class Register {
  static async register1(payload: {
    firstname: string;
    lastname: string;
    telephoneNo: string;
    nickname?: string;
  }): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');

    if (!farmer_id) {
      return registerClient
        .post(BASE_URL + `/auth/farmer/register`, {
          ...payload,
          status: 'OPEN',
          address: {
            address1: '',
            address2: '',
            address3: '',
            provinceId: 0,
            districtId: 0,
            subdistrictId: 0,
            postcode: '',
          },
        })
        .then(async response => {
          const farmer_id = response.data.id;
          await AsyncStorage.setItem('farmer_id', farmer_id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return registerClient
        .patch(BASE_URL + `/farmer/${farmer_id}`, {
          ...payload,
          status: 'OPEN',
        })
        .then(async response => {
          const farmer_id = response.data.id;
          await AsyncStorage.setItem('farmer_id', farmer_id);
          return response.data;
        })
        .catch(error => {
          console.log('error_patch', error);
        });
    }
  }
  static async register2(
    telephoneNo: string,
    address1: string,
    address2: string,
    provinceId: number,
    districtId: number,
    subdistrictId: number,
    postcode: string,
  ): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return registerClient
      .post(BASE_URL + '/auth/farmer/register', {
        id: farmer_id,
        telephoneNo: telephoneNo,
        status: 'OPEN',
        address: {
          address1: address1,
          address2: address2,
          provinceId: provinceId,
          districtId: districtId,
          subdistrictId: subdistrictId,
          postcode: postcode,
        },
      })
      .then(async response => {
        const farmer_id = response.data.id;
        await AsyncStorage.setItem('farmer_id', farmer_id);
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async register3(
    telephoneNo: string,
    plotName: string,
    raiAmount: number,
    plantName: string,
    lat: string,
    long: string,
    locationName: string,
    landmark: string,
  ): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const index = 0;
    if (!plotName) {
      return registerClient
        .post(BASE_URL + `/auth/farmer/register`, {
          id: farmer_id,
          status: 'PENDING',
          telephoneNo: telephoneNo,
          farmerPlot: [
            {
              plotName: `แปลงที่ ${index + 1} ${plantName}`,
              raiAmount: raiAmount,
              plantName: plantName,
              lat: lat,
              long: long,
              locationName: locationName,
              landmark: landmark,
            },
          ],
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return registerClient
        .post(BASE_URL + `/auth/farmer/register`, {
          id: farmer_id,
          status: 'PENDING',
          telephoneNo: telephoneNo,
          farmerPlot: [
            {
              plotName: plotName,
              raiAmount: raiAmount,
              plantName: plantName,
              lat: lat,
              long: long,
              locationName: locationName,
              landmark: landmark,
            },
          ],
        })
        .then(async response => {
          const farmerPlot_id = response.data.id;
          await AsyncStorage.setItem('farmerPlot_id', farmerPlot_id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  static async uploadFarmerPlot(farmerPlot: any): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return registerClient
      .post(BASE_URL + '/auth/farmer/register', {
        id: farmer_id,
        farmerPlot: farmerPlot,
        status: 'OPEN',
      })
      .then(async response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static deleteFarmerPlot(id?: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + '/farmer-plot/' + id)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        console.log(err, 'err deleteFarmerPlot');
      });
  }
  static async registerSkip4(): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return registerClient
      .post(BASE_URL + '/auth/farmer/register', {
        id: farmer_id,
        status: 'PENDING',
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async register4(telephoneNo: string, idNo: string): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return registerClient
      .post(BASE_URL + `/auth/farmer/register`, {
        id: farmer_id,
        idNo: idNo,
        status: 'OPEN',
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async changeToPending(): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return httpClient
      .patch(BASE_URL + `/farmer/${farmer_id}`, {
        status: 'PENDING',
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async onDeleteAccount(id: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + '/farmer/' + id)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async uploadProfileImage(image: any): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const imageSplit = image.assets[0].uri.split('/');
    const fileName = image.assets[0].fileName
      ? image.assets[0].fileName
      : imageSplit[imageSplit.length - 1];
    const data = new FormData();
    data.append('file', {
      uri: image.assets[0].uri,
      name: fileName,
      type: image.assets[0].type,
    });
    data.append('resourceId', farmer_id);
    data.append('resource', 'FARMER');
    data.append('category', 'PROFILE_IMAGE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async uploadFarmerIDCard(file: any): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', farmer_id);
    data.append('resource', 'FARMER');
    data.append('category', 'ID_CARD_IMAGE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
