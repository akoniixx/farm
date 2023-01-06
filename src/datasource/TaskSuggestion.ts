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
}

