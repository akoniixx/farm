export interface RewardListType {
  id: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  rewardNo: string;
  score: string | null;
  amount: number;
  used: number;
  remain: number;
  description: string;
  condition: string;
  startExchangeDate: string;
  expiredExchangeDate: string;
  startUsedDate: string | null;
  expiredUsedDate: string | null;
  startExchangeDateCronJob: string | null;
  expiredExchangeDateCronJob: string;
  startUsedDateCronJob: string | null;
  expiredUsedDateCronJob: string | null;
  digitalCode: string | null;
  status: string;
  statusUsed: string | null;
  createAt: string;
  updateAt: string;
}
export interface DigitalRewardType extends Record<string, any> {}
