import axios from 'axios';
import { BASE_URL, httpClient } from '../config/develop-config';

export class historyPoint {
  static async getPoint(farmerId: string): Promise<any> {
    return axios
      .post(BASE_URL + `/promotion/historypoint-quota/getpoint`, {
        farmerId: farmerId,
      })
      .then(res => {
        return res.data;
      });
  }
}
export const getAllHistoryPoint = async (
  farmerId: string,
  page?: number,
  take?: number,
) => {
  const params = {
    farmerId: farmerId,
    page: page,
    take: take,
  };
  return httpClient
    .get(BASE_URL + '/promotion/historypoint-quota/getallhistory', { params })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getAllPoint');
    });
};
