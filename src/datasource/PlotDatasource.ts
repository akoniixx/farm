import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BASE_URL,
  httpClient,
  uploadFileClient,
  uploadFileProfile,
} from '../config/develop-config';

export class PlotDatasource {
  static async getPlotlist(farmer_id: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/farmer-plot?farmerId=${farmer_id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
 
}
