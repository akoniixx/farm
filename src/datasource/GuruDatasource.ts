import axios from 'axios';
import { BASE_URL } from '../config/develop-config';

export class GuruKaset {
  static async findAllNews({
    status,
    application,
    sortField,
    sortDirection,
    limit,
    offset,
    pageType,
  }: {
    status: string;
    application: string;
    sortField?: string;
    sortDirection?: string;
    limit?: number;
    offset?: number;
    pageType?: string;
  }): Promise<any> {
    return axios
      .post(BASE_URL + `/promotion/news/find-all-news`, {
        status: status,
        application: application,
        sortField: sortField,
        sortDirection: sortDirection,
        limit: limit,
        offset: offset,
        pageType: pageType,
      })
      .then(res => {
        return res.data;
      });
  }
  static async findAllNewsPin(
    status: string,
    application: string,
    limit?: number,
    offset?: number,
    pageType?: string,
  ): Promise<any> {
    return axios
      .post(BASE_URL + `/promotion/news/find-all-news`, {
        status: status,
        application: application,
        limit: limit,
        offset: offset,
        pageType: pageType,
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
  static async updateId(
    id: string,
    read: number,
    pinAll: boolean,
    pinMain: boolean,
  ): Promise<any> {
    const params = {
      read: read,
      pinAll: pinAll,
      pinMain: pinMain,
    };
    return axios
      .post(BASE_URL + `/promotion/news/update/${id}`, params)
      .then(res => {
        return res.data;
      });
  }
}
