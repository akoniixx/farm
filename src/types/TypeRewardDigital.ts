interface DronerRedeemHistory {
  status: string;
  updateBy: string;
  dronerTransactionId: string;
  beforeStatus: any;
  deliveryCompany: any;
  trackingNo: any;
  remark: any;
  id: string;
  createAt: string;
  updateAt: string;
}

export interface DronerTransaction {
  dronerId: string;
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
  receiverDetail: any;
  redeemDetail: DigitalDetail;

  dronerRedeemHistories: DronerRedeemHistory[];
  campaignId: any;
  campaignName: any;
  missionId: any;
  id: string;
  createAt: string;
  updateAt: string;
  reward: Reward;
}

export interface DigitalRewardType {
  action: string;
  status: string;
  dronerTransaction: DronerTransaction;
  taskId: any;
  taskNo: any;
  pointNo: any;
  id: string;
  createAt: string;
  updateAt: string;
}

interface DigitalDetail {
  branch: {
    code: string;
    name: string;
  };
  rewardType: string;
  redeemStatus: string;
  digitalReward: {
    isRedeem: boolean;
    redeemCode: string;
  };
  rewardExchange: string;
  rewardQuantity: number;
  remark: string | null;
}

interface DronerRedeemHistory {
  id: string;
  dronerTransactionId: string;
  status: string;
  beforeStatus: any;
  deliveryCompany: any;
  trackingNo: any;
  remark: any;
  redeemCode: any;
  branchName: any;
  branchCode: any;
  createAt: string;
  updateAt: string;
  updateBy: string;
}

interface Reward {
  id: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  rewardNo: string;
  score: number;
  amount: number;
  used: number;
  remain: string;
  description: string;
  condition: string;
  startExchangeDate: string;
  expiredExchangeDate: string;
  startUsedDate: string;
  expiredUsedDate: string;
  startExchangeDateCronJob: any;
  expiredExchangeDateCronJob: string;
  startUsedDateCronJob: any;
  expiredUsedDateCronJob: string;
  digitalCode: string;
  status: string;
  statusUsed: string;
  createBy: string;
  createAt: string;
  updateAt: string;
}
