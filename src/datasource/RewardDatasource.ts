import {BASE_URL, httpClient} from '../config/develop-config';

interface RewardPayload {
  page: number;
  take: number;
}
const getListRewards = async ({page, take}: RewardPayload) => {
  return httpClient
    .get(BASE_URL + '/promotion/reward/queryall', {
      params: {
        page: page,
        take: take,
        status: 'ACTIVE',
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => console.log(err));
};
const getRewardDetail = async (id: string) => {
  return httpClient
    .get(BASE_URL + '/promotion/reward/query/' + id)
    .then(res => {
      return res.data;
    })
    .catch(err => console.log(err));
};

export const rewardDatasource = {
  getListRewards,
  getRewardDetail,
};
