import { BASE_URL, httpClient } from '../config/develop-config';

interface GetRewardType {
  page?: number;
  take?: number;
  rewardType?: 'PHYSICAL' | 'DIGITAL';
  rewardExchange?: 'SCORE' | 'MISSION';
  application: 'DRONER' | 'FARMER';
  status?: 'ACTIVE' | 'INACTIVE';
}
export interface RedeemPayload {
  farmerId: string;
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

interface FarmerReadyToUse {
  page: number;
  take: number;
  farmerId: string;
}
interface UseRedeemPayload {
  farmerTransactionId: string;
  shopName: string;
  shopCode: string;
  updateBy: string;
}
const getRewardList = async ({
  application = 'FARMER',
  status = 'ACTIVE',
  ...payload
}: GetRewardType) => {
  const newPayload = {
    ...payload,
    application,
    status,
  };
  let query = '?';
  for (let key in newPayload) {
    const isLastKey = key === Object.keys(newPayload).pop();
    if (isLastKey) {
      query += `${key}=${newPayload[key as keyof GetRewardType]}`;
      break;
    }
    if (newPayload[key as keyof GetRewardType]) {
      query += `${key}=${newPayload[key as keyof GetRewardType]}&`;
    }
  }
  try {
    const res = await httpClient.get(
      BASE_URL + '/promotion/reward/queryall' + query,
    );
    return res.data;
  } catch (err) {
    return err;
  }
};
const getHistoryRedeem = async (payload: {
  page: number;
  take: number;
  farmerId: string;
}) => {
  return await httpClient
    .get(
      BASE_URL +
        `/promotion/reward/my-reward-farmer-history?page=${payload.page}&take=${payload.take}&farmerId=${payload.farmerId}`,
    )
    .then(res => res.data)
    .catch(err => err);
};
const getRewardDetail = async (rewardId: string) => {
  return await httpClient
    .get(BASE_URL + '/promotion/reward/query/' + rewardId)
    .then(res => res.data)
    .catch(err => err);
};
const getRedeemDetail = async (transactionsId: string) => {
  return await httpClient
    .get(
      BASE_URL +
        '/promotion/farmer-transactions/get-farmer-reward-history/' +
        transactionsId,
    )
    .then(res => res.data)
    .catch(err => err);
};

const getReadyToUseReward = async ({
  page,
  take,
  farmerId,
}: FarmerReadyToUse) => {
  return await httpClient
    .get(
      BASE_URL +
        '/promotion/reward/my-reward-farmer-ready-to-use' +
        `?page=${page}&take=${take}&farmerId=${farmerId}`,
    )
    .then(res => res.data)
    .catch(err => err);
};
const onRedeemReward = async (payload: any) => {
  return await httpClient
    .post(BASE_URL + '/promotion/farmer-transactions/redeem-reward', payload)
    .then(res => res.data)
    .catch(err => err);
};

const redeemReward = async (payload: RedeemPayload) => {
  return await httpClient
    .post(BASE_URL + '/promotion/farmer-transactions/redeem-reward', payload)
    .then(res => res.data)
    .catch(err => err);
};
const useRedeemReward = async (payload: UseRedeemPayload) => {
  return await httpClient
    .post(BASE_URL + '/promotion/farmer-transactions/use-redeem-code', payload)
    .then(res => res.data)
    .catch(err => err);
};
const getPrepareRewardList = async ({
  page,
  take,
  farmerId,
}: FarmerReadyToUse) => {
  return await httpClient
    .get(
      BASE_URL +
        '/promotion/reward/my-reward-farmer-prepare' +
        `?page=${page}&take=${take}&farmerId=${farmerId}`,
    )
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
  redeemReward,
  useRedeemReward,
  getPrepareRewardList,
};
