import {BASE_URL, httpClient} from '../config/develop-config';

interface RewardPayload {
  page: number;
  take: number;
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
const getListRewards = async ({page, take}: RewardPayload) => {
  return httpClient
    .get(BASE_URL + '/promotion/reward/queryall', {
      params: {
        page: page,
        take: take,
        status: 'ACTIVE',
        rewardExchange: 'SCORE',
        rewardType: 'PHYSICAL',
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getRewardDetail = async (id: string) => {
  return httpClient
    .get(BASE_URL + '/promotion/reward/query/' + id)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const redeemReward = async (payload: RedeemPayload) => {
  return httpClient
    .post(BASE_URL + '/promotion/droner-transactions/redeem-reward', {
      ...payload,
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getRedeemDetail = async (id: string) => {
  return httpClient
    .get(
      BASE_URL +
        '/promotion/droner-transactions/get-droner-reward-history/' +
        id,
    )
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const rewardDatasource = {
  getListRewards,
  getRewardDetail,
  redeemReward,
  getRedeemDetail,
};
