import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, httpClient} from '../config/develop-config';


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
}
