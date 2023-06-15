interface RedeemDetail {
  redeemStatus: string;
  rewardType: string;
  rewardExchange: string;
  rewardQuantity: number;
  redeemCode: string;
}

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

interface DronerTransaction {
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
  redeemDetail: RedeemDetail;
  dronerRedeemHistories: DronerRedeemHistory[];
  campaignId: any;
  campaignName: any;
  missionId: any;
  id: string;
  createAt: string;
  updateAt: string;
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
