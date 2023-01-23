import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, httpClient } from '../config/develop-config';

export interface PayloadDronerSearch {
  farmerId?: string;
  farmerPlotId?: string;
  dateAppointment?: string;
  distanceMin?: number;
  distanceMax?: number;
  ratingMin?: number;
  ratingMax?: number;
  status?: string;
}
export interface PayloadCal {
  farmerPlotId: string;
  cropName: string;
  raiAmount: number;
  couponCode: string;
}

export class PlotDatasource {
  static async getPlotlist(farmer_id: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/farmer-plot?farmerId=${farmer_id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async getLocationPrice({
    provinceId,
    cropName,
  }: {
    provinceId: string;
    cropName: string;
  }): Promise<any> {
    return httpClient
      .get(
        BASE_URL +
          `/tasks/location-price/get-location-price?provinceId=${provinceId}&cropName=${cropName}`,
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async searchDroner({
    farmerId,
    farmerPlotId,
    dateAppointment,
  }: {
    farmerId: string;
    farmerPlotId: string;
    dateAppointment: string;
  }) {
    const payload: PayloadDronerSearch = {
      farmerId,
      farmerPlotId,
      dateAppointment,
      status: 'สะดวก',
      distanceMin: 0,
      distanceMax: 200,
      ratingMin: 0,
      ratingMax: 5,
    };
    return httpClient
      .post(BASE_URL + '/tasks/task/search-droner', payload)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async getCalculatePrice(payload: PayloadCal) {
    return httpClient
      .post(BASE_URL + '/tasks/task/calculate-price', payload)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
