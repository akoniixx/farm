import axios from 'axios';
import {BASE_URL} from '../config/develop-config';

export class Campaign {
  static async getImage(
    application: string,
    campaignType: string,
    status: string,
  ): Promise<any> {
    return axios
      .get(BASE_URL + '/promotion/campaign/find-all-campaign', {
        params: {
          application: application,
          campaignType: campaignType,
          status: status,
        },
      })
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }

  static async getQuota(
    campaignId: string,
    dronerId: string | null,
  ): Promise<any> {
    return axios
      .post(BASE_URL + '/promotion/historypoint-quota/get-latest-quota', {
        campaignId: campaignId,
        dronerId: dronerId,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => console.log(err));
  }
}
