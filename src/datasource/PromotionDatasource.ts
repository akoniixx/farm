import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, httpClient } from '../config/develop-config';

export const usedCouponOnline = async (id : string,promotionId : string) => {
  return httpClient.post(
    BASE_URL + `/promotion/farmer-promotions/used`,
  );
};

export const usedCoupon = async (couponCode: string) => {
  return httpClient.get(
    BASE_URL + `/promotion/promotions/usedoffline/${couponCode}`,
  );
};

export const checkCouponByCode = async (couponCode: string) => {
  return httpClient
    .get(BASE_URL + `/promotion/promotions/getbycode/${couponCode}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
};

export const getCoupons = async (
  page: number,
  take: number,
  sortStatus?: string,
  sortType?: string,
  sortCoupon?: string,
  startDate?: string,
  expiredDate?: string,
  search?: string,
) => {
  const params = {
    page: page,
    take: take,
    sortStatus: sortStatus,
    sortCoupon: sortCoupon,
    sortType: sortType,
    startDate: startDate,
    expiredDate: expiredDate,
    search: search,
  };
  return httpClient
    .get(BASE_URL + '/promotion/promotions', { params })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getCoupon');
    });
};

export const getCouponUser = async (page: number, take: number) => {
  const farmerId = await AsyncStorage.getItem('farmer_id');
  const params = {
    farmerId: farmerId,
    page: page,
    take: take,
  };
  return httpClient
    .get(BASE_URL + '/promotion/farmer-promotions/query', { params })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getCoupon');
    });
};

export const getMyCoupon = async (
  page: number,
  take: number,
  used?: boolean,
) => {
  const farmerId = await AsyncStorage.getItem('farmer_id');
  const params = {
    farmerId: farmerId,
    page: page,
    take: take,
    used: used,
  };
  return httpClient
    .get(BASE_URL + '/promotion/farmer-promotions', { params })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getCoupon');
    });
};

export const keepCoupon = async (promotionId: string,couponCode? : string) => {
  const farmerId = await AsyncStorage.getItem('farmer_id');
  return httpClient
    .post(BASE_URL + '/promotion/farmer-promotions/keep', {
      farmerId: farmerId,
      promotionId: promotionId,
      couponCode : couponCode
    })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getCoupon');
    });
};
