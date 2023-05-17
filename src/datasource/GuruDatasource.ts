import axios from 'axios';
import {BASE_URL, httpClient} from '../config/develop-config';

export class GuruKaset {
  static async findAllNews(
    status: string,
    application: string,
    sortField?: string,
    sortDirection?: string,
    limit?: number,
    offset?: number,
  ): Promise<any> {
    return axios
      .post(BASE_URL + `/promotion/news/find-all-news`, {
        status: status,
        application: application,
        sortField: sortField,
        sortDirection: sortDirection,
        limit: limit,
        offset: offset,
      })
      .then(res => {
        return res.data;
      });
  }
  static async getById(id: string): Promise<any> {
    return axios.get(BASE_URL + `/promotion/news/` + id).then(res => {
      return res.data;
    });
  }
  static async updateId(id: string, read: number): Promise<any> {
    return axios
      .post(BASE_URL + `/promotion/news/update/` + id, {read})
      .then(res => {
        return res.data;
      });
  }
}
