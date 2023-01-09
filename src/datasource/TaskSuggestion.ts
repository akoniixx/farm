import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  BASE_URL
} from '../config/develop-config';

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
        dateAppointment: dateAppointment        
      })
      .then(res => {
        return res.data;
      })
  }
  static async DronerUsed(
    farmerId: string,
    farmerPlotId: string,
    dateAppointment: string,
    limit: number,
    offset: number
    ): Promise<any> {
    return axios
      .post(BASE_URL + `/tasks/task-suggestion/droner-ever-used`, {
        farmerId: farmerId,
        farmerPlotId: farmerPlotId,
        dateAppointment: dateAppointment,
        limit: limit,
        offset: offset     
      })
      .then(res => {
        return res.data;
      })
  }
}

