import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  BASE_URL,
  httpClient,
  registerClient,
  uploadFileClient,
} from '../config/develop-config';

export class Authentication {
  static generateOtp(telNumber: String): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/droner/request-login-otp', {
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
      .post(BASE_URL + '/auth/droner/verify-otp', payload)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async genOtpDeleteAccount(telNumber: String): Promise<any> {
    return httpClient
      .post(BASE_URL + '/auth/droner/request-delete-otp', {
        telephoneNo: telNumber,
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
      .delete(BASE_URL + '/droner/' + id)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async getImageUrl(path: string) {
    return httpClient
      .get(BASE_URL + '/file/geturl?path=' + path)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async generateOtpRegister(telNumber: String): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/droner/request-register-otp', {
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
  static login({
    telephoneNo,
    otpCode,
    token,
    refCode,
  }: {
    telephoneNo: string;
    otpCode: string;
    token: string;
    refCode: string;
  }): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/droner/verify-otp', {
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
  static async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('droner_id');
  }

  static getBankList(): Promise<any> {
    return httpClient
      .get(BASE_URL + '/bank-data')
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }
  static async uploadDronerIDCard(file: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const data = new FormData();
    data.append('file', {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    });
    data.append('resourceId', droner_id);
    data.append('resource', 'DRONER');
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

  static async uploadBankImage(file: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', droner_id);
    data.append('resource', 'DRONER');
    data.append('category', 'BOOK_BANK');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async updateBookbank(
    isBookBank: boolean,
    bankName: string,
    bankAccountName: string,
    accountNumber: string,
    isConsentBookBank: boolean,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const params = {
      isBookBank: isBookBank,
      bankName: bankName,
      bankAccountName: bankAccountName,
      accountNumber: accountNumber,
      isConsentBookBank: isConsentBookBank,
    };
    return httpClient
      .patch(BASE_URL + `/droner/${droner_id}`, params)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async updateIDCardNumber(idNumber: string): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient.patch(BASE_URL + `/droner/${droner_id}`, {
      idNo: idNumber,
    });
  }
}

export class Register {
  static getDroneBrand(page: number, take: number): Promise<any> {
    return registerClient
      .get(BASE_URL + `/drone-brand?isActive=true&page=${page}&take=${take}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static getDroneBrandType(id: string): Promise<any> {
    return registerClient
      .get(BASE_URL + `/drone-brand/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async registerStep2(
    firstname: string,
    lastname: string,
    birthDate: Date,
    telephoneNo: string,
    address1: string,
    address2: string,
    provinceId: string,
    districtId: string,
    subdistrictId: string,
    postcode: string,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    if (!droner_id) {
      return registerClient
        .post(BASE_URL + '/auth/droner/register', {
          firstname: firstname,
          lastname: lastname,
          birthDate: birthDate,
          telephoneNo: telephoneNo,
          status: 'OPEN',
          address: {
            address1: address1,
            address2: address2,
            address3: '',
            provinceId: provinceId,
            districtId: districtId,
            subdistrictId: subdistrictId,
            postcode: postcode,
          },
        })
        .then(async response => {
          const droner_id = response.data.id;
          await AsyncStorage.setItem('droner_id', droner_id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return registerClient
        .post(BASE_URL + '/auth/droner/register', {
          id: droner_id,
          firstname: firstname,
          lastname: lastname,
          telephoneNo: telephoneNo,
          status: 'OPEN',
          address: {
            address1: address1,
            address2: address2,
            address3: '',
            provinceId: provinceId,
            districtId: districtId,
            subdistrictId: subdistrictId,
            postcode: postcode,
          },
        })
        .then(async response => {
          const droner_id = response.data.id;
          await AsyncStorage.setItem('droner_id', droner_id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  static async uploadProfileImage(image: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const data = new FormData();
    data.append('file', {
      uri: image.assets[0].uri,
      name: image.assets[0].fileName,
      type: image.assets[0].type,
    });
    data.append('resourceId', droner_id);
    data.append('resource', 'DRONER');
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

  static async uploadDronerdrone(
    dronerDrone: any,
    percentSuccess?: number,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + '/auth/droner/register', {
        id: droner_id,
        dronerDrone: dronerDrone,
        status: 'OPEN',
        percentSuccess: percentSuccess,
      })
      .then(async response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async registerStep3(
    telephoneNo: string,
    provinceId: number,
    districtId: number,
    subdistrictId: number,
    locationName: string,
    expPlant: string[],
    lat: string,
    long: string,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + '/auth/droner/register', {
        id: droner_id,
        status: 'OPEN',
        telephoneNo: telephoneNo,
        expPlant: expPlant,
        dronerArea: {
          lat: lat,
          long: long,
          provinceId: provinceId,
          districtId: districtId,
          subdistrictId: subdistrictId,
          locationName: locationName,
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async registerUpPlants(
    expPlant: string[],
    percentSuccess: number,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + '/auth/droner/register', {
        id: droner_id,
        expPlant: expPlant,
        status: 'OPEN',
        percentSuccess: percentSuccess,
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async uploadDronerCard(file: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', droner_id);
    data.append('resource', 'DRONER');
    data.append('category', 'ID_CARD_IMAGE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', {data, status: 'OPEN'})
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async registerSkipStep4(): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + '/auth/droner/register', {
        id: droner_id,
        status: 'PENDING',
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async registerStep4(
    telephoneNo: string,
    idNo: string,
    percentSuccess?: number,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + '/auth/droner/register', {
        id: droner_id,
        telephoneNo: telephoneNo,
        idNo: idNo,
        percentSuccess: percentSuccess,
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async changeToPending(): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .patch(BASE_URL + `/droner/${droner_id}`, {
        status: 'PENDING',
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async uploadDronerLicense(drone_id: any, file: any): Promise<any> {
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', drone_id);
    data.append('resource', 'DRONER_DRONE');
    data.append('category', 'DRONER_LICENSE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async uploadDroneLicense(drone_id: any, file: any): Promise<any> {
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', drone_id);
    data.append('resource', 'DRONER_DRONE');
    data.append('category', 'DRONE_LICENSE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async uploadDronerIDCard(file: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', droner_id);
    data.append('resource', 'DRONER');
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

  static async registerStep1V2(
    firstname: string,
    lastname: string,
    telephoneNo: string,
  ) {
    const droner_id = await AsyncStorage.getItem('droner_id');
    if (!droner_id) {
      return registerClient
        .post(BASE_URL + '/auth/droner/register', {
          firstname: firstname,
          lastname: lastname,
          telephoneNo: telephoneNo,
          status: 'OPEN',
          address: {
            address1: '-',
            address2: '-',
            provinceId: 0,
            districtId: 0,
            subdistrictId: 0,
            postcode: '-',
          },
          percentSuccess: 25,
        })
        .then(async response => {
          await AsyncStorage.setItem('droner_id', response.data.id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return registerClient
        .post(BASE_URL + '/auth/droner/register', {
          id: droner_id,
          firstname: firstname,
          lastname: lastname,
          telephoneNo: telephoneNo,
          status: 'OPEN',
          address: {
            address1: '-',
            address2: '-',
            provinceId: 0,
            districtId: 0,
            subdistrictId: 0,
            postcode: '-',
          },
          percentSuccess: 25,
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  static async registerStep2V2(
    lat: string,
    long: string,
    provinceId?: number,
    districtId?: number,
    subdistrictId?: number,
  ) {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + '/auth/droner/register', {
        id: droner_id,
        status: 'OPEN',
        percentSuccess: 50,
        dronerArea: {
          lat: lat,
          long: long,
          provinceId: provinceId,
          districtId: districtId,
          subdistrictId: subdistrictId,
        },
      })
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }
}
