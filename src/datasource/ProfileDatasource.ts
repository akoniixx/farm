import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BASE_URL,
  httpClient,
  uploadFileClient,
  uploadFileProfile,
} from '../config/develop-config';

export class ProfileDatasource {
  static async getProfile(farmer_id: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/farmer/${farmer_id}`)
      .then(async response => {
        const farmer_status = response.data.status;
        await AsyncStorage.setItem('farmer_status', farmer_status);
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static deleteAccount(farmerId: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + `/farmer/${farmerId}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async getImgePathProfile(
    farmerId: string,
    imagePath: string,
  ): Promise<any> {
    return httpClient
      .get(BASE_URL + `/file/geturl?path=${imagePath}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async uploadProfileImage(image: any): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer)id');
    const data = new FormData();
    data.append('file', {
      uri: image.assets[0].uri,
      name: image.assets[0].fileName,
      type: image.assets[0].type,
    });
    data.append('resourceId', farmer_id);
    data.append('resource', 'FARMER');
    data.append('category', 'PROFILE_IMAGE');
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async addIdCard(idcard: string): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return httpClient
      .patch(BASE_URL + `/farmer/${farmer_id}`, {
        idNo: idcard,
      })
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
  //Droner
  static async getDroner(droner_id: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/droner/${droner_id}`)
      .then(async response => {
        // const droner_id = response.data.id;
        // console.log('droner', response);
        // await AsyncStorage.setItem('droner_id', droner_id);
        // return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
