import { BASE_URL, httpClient } from '../config/develop-config';

interface GetRewardType {
  page?: number;
  take?: number;
}
export interface RedeemPayload {
  dronerId: string;
  rewardId: string;
  quantity: number;
  receiverDetail: {
    firstname: string;
    lastname: string;
    tel: string;
    address: string;
    addressId: string;
  };
  updateBy: string;
}
const getRewardList = async (payload: GetRewardType) => {
  let query = '?';
  for (let key in payload) {
    if (payload[key as keyof GetRewardType]) {
      query += `${key}=${payload[key as keyof GetRewardType]}&`;
    }
  }
  try {
    const res = await httpClient.get(BASE_URL + '/reward' + query);
    return res.data;
  } catch (err) {
    return err;
  }
};
const getHistoryRedeem = async (payload: any) => {
  return await httpClient
    .get(BASE_URL + '/reward/history')
    .then(res => res.data)
    .catch(err => err);
};
const getRewardDetail = async (payload: any) => {
  return await httpClient
    .get(BASE_URL + '/reward/' + payload)
    .then(res => res.data)
    .catch(err => err);
};
const getRedeemDetail = async (payload: any) => {
  return await httpClient
    .get(BASE_URL + '/reward/history/' + payload)
    .then(res => res.data)
    .catch(err => err);
};

const getReadyToUseReward = async (payload: any) => {
  return await httpClient
    .get(BASE_URL + '/reward/ready-to-use')
    .then(res => res.data)
    .catch(err => err);
};
const onRedeemReward = async (payload: any) => {
  return await httpClient
    .post(BASE_URL + '/reward/redeem', payload)
    .then(res => res.data)
    .catch(err => err);
};
export const rewardDatasource = {
  getRewardList,
  getHistoryRedeem,
  getRewardDetail,
  getRedeemDetail,
  getReadyToUseReward,
  onRedeemReward,
};
