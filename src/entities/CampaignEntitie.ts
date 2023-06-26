interface Condition {
  num: number;
  rai: number;
  point: number | null;
  quata: number;
  maxQuata: number;
  rewardId: number | null;
  rewardName: string;
}

export interface CampaignEntitie {
  id: string;
  status: string;
  application: string;
  description: string;
  campaignName: string;
  campaignType: string;
  startDate: string;
  endDate: string;
  createBy: string;
  updateBy: string;
  pathImageBanner: string;
  pathImageReward: string;
  pathImageRewardRound: string;
  missionNo: string;
  createdAt: string;
  updatedAt: string;
  isDeleteFarmer: boolean;
  isDeleteDroner: boolean;
  countSubMission: number;
  rulesCampaign: string;
  condition: Array<Condition>;
}

export const init_campaign: CampaignEntitie = {
  id: '',
  status: '',
  application: '',
  description: '',
  campaignName: '',
  campaignType: '',
  startDate: '',
  endDate: '',
  createBy: '',
  updateBy: '',
  pathImageBanner: '',
  pathImageReward: '',
  pathImageRewardRound: '',
  missionNo: '',
  createdAt: '',
  updatedAt: '',
  isDeleteFarmer: false,
  isDeleteDroner: false,
  countSubMission: 0,
  rulesCampaign: '',
  condition: [],
};
