import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, httpClient } from '../config/develop-config';

export class FCMtokenDatasource {
  static async getNotificationList(): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return httpClient
      .get(BASE_URL + `/fcm/notification/farmer/${farmer_id}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static readNotification(id: string): Promise<any> {
    return httpClient
      .post(BASE_URL + `/fcm/notification/read/${id}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async saveFCMtoken(fcmtoken: string): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return httpClient
      .post(BASE_URL + '/user-device', {
        farmerId: farmer_id,
        token: fcmtoken,
      })
      .then(res => {
        console.log(res.data);
        return res.data;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
  static async deleteFCMtoken(fcmtoken: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + `/user-device/${fcmtoken}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static deleteNotiItem(id: string): Promise<any> {
    return httpClient
      .delete(BASE_URL + `/fcm/notification/delete/${id}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async deleteNotiAllItem(): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    return httpClient
      .delete(BASE_URL + `/fcm/notification/delete-all/${farmer_id}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
}
