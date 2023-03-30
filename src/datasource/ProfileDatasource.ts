import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BASE_URL,
  httpClient,
  uploadFileProfile,
} from '../config/develop-config';

export class ProfileDatasource {
  static async getProfile(dronerID: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/droner/${dronerID}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static deleteAccount(dronerID: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + `/droner/${dronerID}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async getImgePath(
    dronerID: string,
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
      .post(BASE_URL + '/droner-drone', dronedata)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async uploadDronerLicense( file: any): Promise<any> {
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
    return httpClient
      .get(BASE_URL + `/tasks/task/revenue-droner/${drone_id}`)
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
    return uploadFileProfile
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
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
    // const drone_id = '480cca3a-f5c8-4df5-aeae-765c6aadf13d';
    return httpClient
      .get(
        BASE_URL +
          `/tasks/task-revenue/get-history-revenue?dronerId=${drone_id}&dateAppointmentStart=${start}&dateAppointmentEnd=${end}&page=${page}&take=${take}`,
      )
      .then(res => res.data)
      .catch(err => console.log(err));
  }

  static async editServiceArea(
    area : string,
    lat : number,
    long : number,
    provinceId : number,
    districtId : number,
    subdistrictId : number,
    locationName : string
  ): Promise<any>{
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient.patch(
      BASE_URL + `/droner/${droner_id}`,{
        dronerArea : {
          dronerId : droner_id,
          area : area,
          lat : lat,
          long : long,
          provinceId : provinceId,
          districtId : districtId,
          subdistrictId : subdistrictId,
          locationName : locationName
        }
      }
    )  
    .then(res => res.data)
    .catch(err => console.log(err));
  }
}
