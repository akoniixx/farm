export interface RedemptionTransaction extends Record<string, any> {
  farmerTransactionsId: string;
  redeemDetail: RedeemDetail;
  rewardId: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  redeemDate: string;
}

interface RedeemDetail {
  branch: null | string; // Assuming 'null' or a string value
  rewardType: string;
  redeemStatus: string;
  digitalReward: DigitalReward;
  rewardExchange: string;
  rewardQuantity: number;
}

interface DigitalReward {
  isRedeem: boolean;
  redeemCode: string;
}
