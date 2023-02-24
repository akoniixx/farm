import axios from 'axios';
import { BASE_URL } from '../config/develop-config';

export class SystemMaintenance {
  static async Maintenance(): Promise<any> {
    return axios
      .get(BASE_URL + `/ma/system-maintenance/get_notices`)
      .then(res => {
        return res.data;
      });
  }
}
