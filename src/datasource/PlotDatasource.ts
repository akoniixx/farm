import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
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
  static async addFarmerPlot(
    plotName: string,
    raiAmount: number,
    landmark: string,
    plantName: string,
    lat: string,
    long: string,
    locationName: string,
    plotAreaId: any,
  ): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    let count = 0
    if (!plotName) {
      return httpClient
        .post(BASE_URL + `/farmer-plot`, {
          plotName: `แปลงที่ ${count + 1} ${plantName}`,
          raiAmount: raiAmount,
          landmark: landmark,
          plantName: plantName,
          locationName: locationName,
          farmerId: farmer_id,
          lat: lat,
          long: long,
          plotAreaId: plotAreaId,
          status: 'PENDING',
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return httpClient
        .post(BASE_URL + `/farmer-plot`, {
          id: farmer_id,
          status: 'PENDING',
          farmerPlot: [
            {
              plotName: plotName,
              raiAmount: raiAmount,
              landmark: landmark,
              plantName: plantName,
              locationName: locationName,
              farmerId: farmer_id,
              lat: lat,
              long: long,
              plotAreaId: plotAreaId,
              status: 'PENDING',
            },
          ],
        })
        .then(async response => {
          const farmerPlot_id = response.data.id;
          await AsyncStorage.setItem('farmerPlot_id', farmerPlot_id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  static async getFarmerPlotById(id: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/farmer-plot/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async updateFarmerPlot(
    plotName: string,
    raiAmount: number,
    landmark: string,
    plantName: string,
    lat: string,
    long: string,
    locationName: string,
    plotAreaId: any,
  ): Promise<any> {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const plotId = await AsyncStorage.getItem('plot_id');
    const index = 0;
    if (!plotName) {
      return httpClient
      .patch(BASE_URL + `/farmer-plot/${plotId}`, {
        plotName: `แปลงที่ ${index + 1} ${plantName}`,
        raiAmount: raiAmount,
        landmark: landmark,
        plantName: plantName,
        lat: lat,
        long: long,
        locationName: locationName,
        plotAreaId: plotAreaId,
        farmerId: farmer_id
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
    }else{
      return httpClient
      .patch(BASE_URL + `/farmer-plot/${plotId}`, {
        plotName: plotName,
        raiAmount: raiAmount,
        landmark: landmark,
        plantName: plantName,
        lat: lat,
        long: long,
        locationName: locationName,
        plotAreaId: plotAreaId,
        farmerId: farmer_id
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });

    }

  
  }
}
