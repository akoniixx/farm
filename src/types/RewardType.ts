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
export interface FarmerTransaction {
  farmerId: string;
  rewardId: string;
  rewardName: string;
  rewardQuantity: number;
  redeemNo: string;
  balance: number;
  beforeValue: number;
  amountValue: number;
  allValue: number;
  beforeRai: number;
  afterRai: number;
  raiAmount: number;
  receiverDetail: ReceiverDetail;
  redeemDetail: RedeemDetail;
  farmerRedeemHistories: FarmerRedeemHistory[];
  campaignId: string | null;
  campaignName: string | null;
  id: string;
  createAt: string;
  updateAt: string;
}

interface ReceiverDetail {
  firstname: string;
  lastname: string;
  tel: string;
}

interface RedeemDetail {
  redeemStatus: string;
  rewardType: string;
  rewardExchange: string;
  rewardQuantity: number;
  branch: {
    code: string;
    name: string;
  } | null;
  digitalReward: DigitalReward;
  remark?: string;
}

interface DigitalReward {
  redeemCode: string;
  isRedeem: boolean;
}

interface FarmerRedeemHistory {
  status: string;
  updateBy: string;
  farmerTransactionId: string;
  beforeStatus: string | null;
  deliveryCompany: string | null;
  trackingNo: string | null;
  remark: string | null;
  redeemCode: string | null;
  branchName: string | null;
  branchCode: string | null;
  id: string;
  createAt: string;
  updateAt: string;
}

export interface DigitalRewardType extends Record<string, any> {
  action: string;
  status: string;
  farmerTransaction: FarmerTransaction;
  taskId: string | null;
  taskNo: string | null;
  pointNo: string | null;
  id: string;
  createAt: string;
  updateAt: string;
}
export interface DigitalRedeemedType {
  farmerRedeemHistories: FarmerRedeemHistory[];
  id: string;
  farmerId: string;
  rewardId: string;
  rewardName: string;
  createAt: string;
  updateAt: string;
  redeemNo: string;
  receiverDetail: ReceiverDetail;
  redeemDetail: RedeemDetail;
  reward: RewardListType;
}
