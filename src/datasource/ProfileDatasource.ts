import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BASE_URL,
  httpClient,
  uploadFileProfile,
} from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';

export class ProfileDatasource {
  static async getProfile(dronerID: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/droner/${dronerID}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        crashlytics().log('getProfile');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          dronerId: dronerID,
        });
        throw error;
      });
  }

  static async deleteAccount(dronerID: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + `/droner/${dronerID}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        crashlytics().log('deleteAccount');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          dronerId: dronerID,
        });
      });
  }

  static async getImgePath(dronerID: string, imagePath: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/file/geturl?path=${imagePath}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('getImagePath');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          dronerId: dronerID,
          imagePath: imagePath,
        });
      });
  }

  static getDroneBrand(page: number, take: number): Promise<any> {
    return httpClient
      .get(BASE_URL + `/drone-brand?isActive=true&page=${page}&take=${take}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static getDroneBrandType(id: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/drone-brand/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('getDroneBrandType');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          id: id,
        });
        console.log(error);
      });
  }

  static addDronerDrone(dronedata: any): Promise<any> {
    return httpClient
      .post(BASE_URL + '/droner-drone', dronedata)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('addDronerDrone');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          dronedata: dronedata,
        });
        console.log(error);
      });
  }

  static async uploadDronerLicense(file: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', droner_id);
    data.append('resource', 'DRONER');
    data.append('category', 'DRONER_LICENSE');
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('uploadDronerLicense');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          droner_id: droner_id ? droner_id : '',
          file: file,
        });
        console.log(error);
      });
  }

  static async uploadIDCard(file: any): Promise<any> {
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
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('uploadIDCard');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          droner_id: droner_id ? droner_id : '',
          file: file,
        });
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
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('uploadDroneLicense');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          drone_id: drone_id ? drone_id : '',
          file: file,
        });
        console.log(error);
      });
  }

  static async getTaskrevenuedroner(): Promise<any> {
    const drone_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .get(BASE_URL + `/tasks/task/revenue-droner/${drone_id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('getTaskrevenuedroner');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          drone_id: drone_id ? drone_id : '',
        });
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
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('uploadDronerIDCard');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          droner_id: droner_id ? droner_id : '',
          file: file,
        });
        console.log(error);
      });
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
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('uploadProfileImage');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          droner_id: droner_id ? droner_id : '',
          image: image,
        });
        console.log(error);
      });
  }

  static async addIdCard(idcard: string): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .patch(BASE_URL + `/droner/${droner_id}`, {
        idNo: idcard,
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('addIdCard');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          droner_id: droner_id ? droner_id : '',
          idcard: idcard,
        });
        console.log(error);
      });
  }
  static async getListTaskInProgress({
    start,
    end,
    page = 1,
    take = 6,
  }: {
    start: string;
    end: string;
    page?: number;
    take?: number;
  }): Promise<{
    summary: any;
    count: number;
    data: [];
  }> {
    const drone_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .get(
        BASE_URL +
          `/tasks/task-revenue/get-history-revenue?dronerId=${drone_id}&dateAppointmentStart=${start}&dateAppointmentEnd=${end}&page=${page}&take=${take}`,
      )
      .then(res => res.data)
      .catch(err => {
        crashlytics().log('getListTaskInProgress');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          drone_id: drone_id ? drone_id : '',
          start: start,
          end: end,
        });
        console.log(err);
      });
  }

  static async editServiceArea(
    area: string,
    lat: number,
    long: number,
    provinceId: number,
    districtId: number,
    subdistrictId: number,
    locationName: string,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .patch(BASE_URL + `/droner/${droner_id}`, {
        dronerArea: {
          dronerId: droner_id,
          area: area,
          lat: lat,
          long: long,
          provinceId: provinceId,
          districtId: districtId,
          subdistrictId: subdistrictId,
          locationName: locationName,
        },
      })
      .then(res => res.data)
      .catch(err => console.log(err));
  }
  static async getAddressListById(id: string) {
    return httpClient
      .get(BASE_URL + `/droner/droner-address/${id}`)
      .then(res => res.data)
      .catch(err => console.log(err));
  }

  static async postMainAddressList({
    dronerId,
    ...payload
  }: {
    dronerId: string;
    provinceId: string;
    districtId: string;
    subdistrictId: string;
    postcode: string;
    address1: string;
    address2: string;
  }) {
    return httpClient
      .post(BASE_URL + `/droner/add-main-address/${dronerId}`, {
        address3: '',
        ...payload,
      })
      .then(res => res.data)
      .catch(err => console.log(err));
  }
  static async postAddressList({
    dronerId,
    ...payload
  }: {
    dronerId: string;
    provinceId: string;
    districtId: string;
    subdistrictId: string;
    postcode: string;
    address1: string;
    address2: string;
  }) {
    return httpClient
      .post(BASE_URL + `/droner/add-other-address/${dronerId}`, {
        address3: '',
        ...payload,
      })
      .then(res => res.data)
      .catch(err => {
        crashlytics().log('postAddressList');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          dronerId: dronerId,
          provinceId: payload.provinceId,
          districtId: payload.districtId,
          subdistrictId: payload.subdistrictId,
          postcode: payload.postcode,
          address1: payload.address1,
          address2: payload.address2,
        });
        console.log(err);
      });
  }
  static async editAddressList({
    addressId,
    ...payload
  }: {
    addressId: string;
    provinceId: string;
    districtId: string;
    subdistrictId: string;
    postcode: string;
    address1: string;
    address2: string;
  }) {
    return httpClient
      .patch(BASE_URL + `/droner/update-other-address/${addressId}`, {
        address3: '',
        ...payload,
      })
      .then(res => res.data)
      .catch(err => {
        crashlytics().log('editAddressList');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          addressId: addressId,
          provinceId: payload.provinceId,
          districtId: payload.districtId,
          subdistrictId: payload.subdistrictId,
          postcode: payload.postcode,
          address1: payload.address1,
          address2: payload.address2,
        });
        console.log(err);
      });
  }
}
