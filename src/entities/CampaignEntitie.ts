interface Condition {
  num: number;
  rai: number;
  point: number | null;
  quata: number;
  maxQuata: number;
  rewardId: number | null;
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
  missionNo: string;
  createdAt: string;
  updatedAt: string;
  isDeleteFarmer: boolean;
  isDeleteDroner: boolean;
  countSubMission: number;
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
  missionNo: '',
  createdAt: '',
  updatedAt: '',
  isDeleteFarmer: false,
  isDeleteDroner: false,
  countSubMission: 0,
};
