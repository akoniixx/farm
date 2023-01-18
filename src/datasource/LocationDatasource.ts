import { BASE_URL, httpClient, registerClient } from '../config/develop-config';

export class QueryLocation {
  static async QueryProvince(): Promise<any> {
    return registerClient
      .get(BASE_URL + '/location/province')
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }

  static async QueryDistrict(provinceId: number): Promise<any> {
    return registerClient
      .get(BASE_URL + `/location/district?provinceId=${provinceId}`)
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }

  static QuerySubDistrict(
    districtId: number,
    districtName: string,
  ): Promise<any> {
    return registerClient
      .get(BASE_URL + `/location/sub-district?districtId=${districtId}`)
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }

  static QueryProfileSubDistrict(districtId: number): Promise<any> {
    return httpClient
      .get(BASE_URL + `/location/sub-district?districtId=${districtId}`)
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }
}
