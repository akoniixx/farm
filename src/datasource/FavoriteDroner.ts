import axios from 'axios';
import { BASE_URL, httpClient } from '../config/develop-config';

export class FavoriteDroner {
  static async addUnaddFav(farmerId: string, dronerId: string): Promise<any> {
    return axios
      .post(BASE_URL + `/tasks/favorite/add-unadd-favorite`, {
        farmerId: farmerId,
        dronerId: dronerId,
      })
      .then(res => {
        return res.data;
      });
  }

  static async findAllFav(
    farmerId: string,
    farmerPlotId: string,
  ): Promise<any> {
    return axios
      .post(BASE_URL + `/tasks/favorite/find-all-favorite`, {
        farmerId: farmerId,
        farmerPlotId: farmerPlotId,
      })
      .then(res => {
        return res.data;
      });
  }
}
