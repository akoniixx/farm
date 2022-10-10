import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, httpClient, uploadFileProfile} from '../config/develop-config';


export class ProfileDatasource {
  static getProfile(
    dronerID: string,
  ): Promise<any> {
    return httpClient
      .get(BASE_URL + `/droner/${dronerID}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static deleteAccount(
    dronerID: string,
  ): Promise<any> {
    return httpClient
      .delete(BASE_URL + `/droner/${dronerID}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static getImgePathProfile(
    dronerID : string,
    imagePath : string
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
        console.log(error);
      });
  }

  static addDronerDrone(dronedata: any): Promise<any> {
    return httpClient
      .post(BASE_URL+ '/droner-drone',dronedata).then(response => {
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
    console.log(data);
    return uploadFileProfile
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
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async getTaskrevenuedroner(): Promise<any> {
    const drone_id = await AsyncStorage.getItem('droner_id');
    return httpClient.get(BASE_URL + `/tasks/task/revenue-droner/${drone_id}`).then(response => {
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
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async uploadProfileImage(
    image : any
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id')
    const data = new FormData();
    data.append('file',{
      uri : image.assets[0].uri,
      name : image.assets[0].fileName,
      type : image.assets[0].type
    })
    data.append('resourceId',droner_id)
    data.append('resource',"DRONER")
    data.append('category',"PROFILE_IMAGE");
    return uploadFileProfile.post(BASE_URL + '/file/upload', data).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }

  static async addIdCard(
    idcard : string
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id')
    return httpClient.patch(
      BASE_URL + `/droner/${droner_id}`,{
        idNo : idcard
      }).then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
    });
  }
}
