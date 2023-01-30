import { BASE_URL, httpClient } from '../config/develop-config';

export const usedCoupon = async (couponCode: string) =>{
  return httpClient
    .get(BASE_URL + `/promotion/promotions/getoffline/${couponCode}`)
}

export const checkCouponOffline = async (couponCode: string) => {
  return httpClient
    .get(BASE_URL + `/promotion/promotions/usedoffline/${couponCode}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
};
