import axios from 'axios';
import { BASE_URL } from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';

export class TaskSuggestion {
  static async searchDroner(
    farmerId: string,
    farmerPlotId: string,
    dateAppointment: string,
  ): Promise<any> {
    return axios
      .post(BASE_URL + `/tasks/task-suggestion/search-droner-suggestion`, {
        farmerId: farmerId,
        farmerPlotId: farmerPlotId,
        dateAppointment: dateAppointment,
      })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          url: BASE_URL + `/tasks/task-suggestion/search-droner-suggestion`,
          payload: JSON.stringify({
            farmerId: farmerId,
            farmerPlotId: farmerPlotId,
            dateAppointment: dateAppointment,
          }),
        });
        console.log(error);
      });
  }
  static async DronerUsed(
    farmerId: string,
    farmerPlotId: string,
    dateAppointment: string,
    limit?: number,
    offset?: number,
  ): Promise<any> {
    return axios
      .post(BASE_URL + `/tasks/task-suggestion/droner-ever-used`, {
        farmerId: farmerId,
        farmerPlotId: farmerPlotId,
        dateAppointment: dateAppointment,
        limit: limit,
        offset: offset,
      })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          url: BASE_URL + `/tasks/task-suggestion/droner-ever-used`,
          payload: JSON.stringify({
            farmerId: farmerId,
            farmerPlotId: farmerPlotId,
            dateAppointment: dateAppointment,
            limit: limit,
            offset: offset,
          }),
        });
        console.log(error);
      });
  }
  static async DronerDetail(
    farmerId: string,
    farmerPlotId: string,
    dronerId: string,
    dateAppointment: string,
    limit?: number,
    offset?: number,
    sortField?: string,
    sortDirection?: string,
  ): Promise<any> {
    return axios
      .post(BASE_URL + `/tasks/task-suggestion/droner-details-review`, {
        farmerId: farmerId,
        farmerPlotId: farmerPlotId,
        dronerId: dronerId,
        dateAppointment: dateAppointment,
        limit: limit,
        offset: offset,
        sortField: sortField,
        sortDirection: sortDirection,
      })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          url: BASE_URL + `/tasks/task-suggestion/droner-details-review`,
          payload: JSON.stringify({
            farmerId: farmerId,
            farmerPlotId: farmerPlotId,
            dronerId: dronerId,
            dateAppointment: dateAppointment,
            limit: limit,
            offset: offset,
            sortField: sortField,
            sortDirection: sortDirection,
          }),
        });
        console.log(error);
      });
  }
}
