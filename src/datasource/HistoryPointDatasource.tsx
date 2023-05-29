import axios from 'axios';
import {BASE_URL, httpClient} from '../config/develop-config';

export class historyPoint {
  static async getPoint(dronerId: string): Promise<any> {
    return axios
      .post(BASE_URL + `/promotion/historypoint-quota/getpoint`, {
        dronerId: dronerId,
      })
      .then(res => {
        return res.data;
      });
  }
}
export const getAllHistoryPoint = async (
  dronerId: string,
  page?: number,
  take?: number,
) => {
  const params = {
    dronerId: dronerId,
    page: page,
    take: take,
  };
  return httpClient
    .get(BASE_URL + '/promotion/historypoint-quota/getallhistory', {params})
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getAllPoint');
    });
};

export const getAllPendingPoint = async (dronerId: string) => {
  return httpClient
    .get(BASE_URL + '/tasks/task-estimate-point/' + dronerId)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getAllPoint');
    });
};
