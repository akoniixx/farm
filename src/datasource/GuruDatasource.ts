import axios from 'axios';
import { BASE_URL } from '../config/develop-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GroupGuruKaset {
  page?: number;
  take?: number;
}
interface GuruKasetAll {
  page?: number;
  limit?: number;
  farmerId?: string;
  groupId?: string;
}
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
  static async getGroupGuru({
    page = 1,
    take = 20,
  }: GroupGuruKaset): Promise<any> {
    return axios
      .get(BASE_URL + `/guru/group-guru?page=${page}&take=${take}`)
      .then(res => {
        return res.data;
      });
  }
  static async getAllGuru(payload: GuruKasetAll): Promise<any> {
    const farmerId = await AsyncStorage.getItem('farmer_id');

    if (farmerId) {
      payload.farmerId = farmerId;
    }

    let query = '';
    for (let key in payload) {
      if (payload[key as keyof GuruKasetAll]) {
        query += `${key}=${payload[key as keyof GuruKasetAll]}&`;
      }
    }
    query = query.slice(0, -1);

    return axios.get(BASE_URL + `/guru/guru/query-app?${query}`).then(res => {
      return res.data;
    });
  }
  static async getGuruById({
    guruId,
    userType = 'FARMER',
  }: {
    guruId: string;
    userType?: 'DRONER' | 'FARMER';
  }): Promise<any> {
    const farmerId = await AsyncStorage.getItem('farmer_id');

    return axios
      .get(BASE_URL + `/guru/guru/query-app/${guruId}/${farmerId}/${userType}`)
      .then(res => {
        return res.data;
      });
  }
  static async updateFavoriteGuru({
    guruId,
  }: {
    guruId: string;
  }): Promise<any> {
    const farmerId = await AsyncStorage.getItem('farmer_id');

    return axios
      .post(BASE_URL + '/guru/like-guru', {
        guruId,
        farmerId: farmerId,
      })
      .then(res => {
        return res.data;
      });
  }
  static async getHaveNewGuruContent({
    farmerId,
  }: {
    farmerId: string;
  }): Promise<any> {
    return axios
      .post(BASE_URL + '/guru/acknowledge-update/check-update', {
        farmerId,
      })
      .then(res => {
        return res.data;
      });
  }
  static async updateHaveNewGuruContent({
    farmerId,
  }: {
    farmerId: string;
  }): Promise<any> {
    return axios
      .post(BASE_URL + '/guru/acknowledge-update/acknowledge-guru', {
        farmerId,
      })
      .then(res => {
        return res.data;
      });
  }
}
