import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, httpClient} from '../config/develop-config';

export class FCMtokenDatasource {
  static async getNotificationList(): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .get(BASE_URL + `/fcm/notification/${droner_id}`)
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
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .post(BASE_URL + '/user-device', {
        dronerId: droner_id,
        token: fcmtoken,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
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
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient
      .delete(BASE_URL + `/fcm/notification/delete-all/${droner_id}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
}
