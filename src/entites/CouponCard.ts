export interface CouponCardEntities {
  id: string;
  couponCode: string;
  couponName: string;
  couponType: string;
  promotionStatus: string;
  promotionType: string;
  discountType: string;
  discount?: number;
  count: number;
  keep?: number;
  used?: number;
  startDate: string;
  expiredDate: string;
  description: string;
  condition: string;
  conditionSpecificFarmer?: boolean | null | undefined;
  couponConditionRai: boolean;
  couponConditionRaiMin?: number | null | undefined;
  couponConditionRaiMax?: number | null | undefined;
  couponConditionService: boolean;
  couponConditionServiceMin?: number | null | undefined;
  couponConditionServiceMax?: number | null | undefined;
  couponConditionPlant: boolean;
  couponConditionPlantList?: any[] | null | undefined;
  couponConditionProvince: boolean;
  couponConditionProvinceList?: string[] | null | undefined;
  couponOfflineCode?: any[];
  keepthis?: boolean;
  disabled?: boolean;
  expired?: boolean;
  callback?: () => void;
}

export interface MyCouponCardEntities {
  passCondition?: any;
  id: string;
  farmerId: string;
  promotionId: string;
  offlineCode?: string | null | undefined;
  used: boolean;
  createAt: string;
  updateAt: string;
  promotion: CouponCardEntities;
}
