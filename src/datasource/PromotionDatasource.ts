import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, httpClient } from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';

export const usedCouponOnline = async (id: string, promotionId: string) => {
  const farmer_id = await AsyncStorage.getItem('farmer_id');
  return httpClient
    .post(BASE_URL + `/promotion/farmer-promotions/used`, {
      id: id,
      promotionId: promotionId,
      farmerId: farmer_id,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + `/promotion/farmer-promotions/used`,
        payload: JSON.stringify({
          id: id,
          promotionId: promotionId,
          farmerId: farmer_id,
        }),
      });
      console.log(error);
    });
};

export const usedCoupon = async (couponCode: string) => {
  return httpClient
    .get(BASE_URL + `/promotion/promotions/usedoffline/${couponCode}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + `/promotion/promotions/usedoffline/${couponCode}`,
        payload: JSON.stringify({
          couponCode: couponCode,
        }),
      });
      console.log(error);
    });
};
export const addHistoryPoint = async (payload: {
  farmerId: string;
  campaignId: string;
  campaignName: string;
  taskId: string;
  taskNo: string;
  action: 'INCREASE' | 'DECREASE';
  amountValue: number;
  raiAmount: number;
}) => {
  return httpClient
    .post(BASE_URL + `/promotion/historypoint-quota/addhistory`, payload)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + `/promotion/historypoint-quota/addhistory`,
        payload: JSON.stringify(payload),
      });
      console.log(error);
    });
};

export const checkCouponByCode = async (couponCode: string) => {
  return httpClient
    .get(BASE_URL + `/promotion/promotions/getbycode/${couponCode}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + `/promotion/promotions/getbycode/${couponCode}`,
        payload: JSON.stringify({
          couponCode: couponCode,
        }),
      });
      console.log(error);
    });
};
export const getPointByFarmerId = async (farmerId: string) => {
  return httpClient
    .post(BASE_URL + '/promotion/historypoint-quota/getpoint', {
      farmerId: farmerId,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + '/promotion/historypoint-quota/getpoint',
        payload: JSON.stringify({
          farmerId: farmerId,
        }),
      });
      throw error;
    });
};
export const getDetailCampaign = async () => {
  return httpClient
    .get(BASE_URL + '/promotion/point')
    .then(res => {
      return res.data;
    })
    .catch(e => {
      crashlytics().recordError(e);
      crashlytics().setAttributes({
        url: BASE_URL + '/promotion/point',
      });
      throw e;
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
      crashlytics().recordError(err);
      crashlytics().setAttributes({
        url: BASE_URL + '/promotion/promotions',
        payload: JSON.stringify(params),
      });
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
      crashlytics().recordError(err);
      crashlytics().setAttributes({
        url: BASE_URL + '/promotion/farmer-promotions/query',
        payload: JSON.stringify(params),
      });
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
      crashlytics().recordError(err);
      crashlytics().setAttributes({
        url: BASE_URL + '/promotion/farmer-promotions',
        payload: JSON.stringify(params),
      });
      console.log(err, 'err getCoupon');
    });
};

export const keepCoupon = async (promotionId: string, couponCode?: string) => {
  const farmerId = await AsyncStorage.getItem('farmer_id');
  if (!couponCode) {
    return httpClient
      .post(BASE_URL + '/promotion/farmer-promotions/keep', {
        farmerId: farmerId,
        promotionId: promotionId,
        offlineCode: couponCode,
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        console.log(err, 'err getCoupon');
      });
  } else {
    return httpClient
      .post(BASE_URL + '/promotion/farmer-promotions/keepoffline', {
        farmerId: farmerId,
        promotionId: promotionId,
        offlineCode: couponCode,
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          url: BASE_URL + '/promotion/farmer-promotions/keepoffline',
          payload: JSON.stringify({
            farmerId: farmerId,
            promotionId: promotionId,
            offlineCode: couponCode,
          }),
        });
        console.log(err, 'err getCoupon');
      });
  }
};

export const checkMyCoupon = async (couponCode: string) => {
  const farmer_id = await AsyncStorage.getItem('farmer_id');

  return httpClient
    .get(
      BASE_URL +
        `/promotion/farmer-promotions/check/${farmer_id}/${couponCode}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getCoupon');
      crashlytics().recordError(err);
      crashlytics().setAttributes({
        url:
          BASE_URL +
          `/promotion/farmer-promotions/check/${farmer_id}/${couponCode}`,
        farmer_id: farmer_id ? farmer_id : 'none',
        couponCode: couponCode,
      });
    });
};
