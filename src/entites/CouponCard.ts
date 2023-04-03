export interface CouponCardEntities{
    id : string;
    couponCode: string;
    couponName : string;
    couponType : string;
    promotionStatus : string;
    promotionType : string;
    discountType : string;
    discount? : number;
    count : number;
    keep? : number;
    used? : number;
    startDate : string;
    expiredDate : string;
    description : string;
    condition : string;
    specialCondition : boolean;
    couponConditionRai : boolean;
    couponConditionRaiMin : number;
    couponConditionRaiMax : number;
    couponConditionService : boolean;
    couponConditionServiceMin : number;
    couponConditionServiceMax : number;
    couponConditionPlant : boolean;
    couponConditionPlantList : any[];
    couponConditionProvince : boolean;
    couponConditionProvinceList : string[],
    couponOfflineCode? : any[],
    keepthis? : boolean;
    disabled? : boolean;
    expired? : boolean;
    callback? : ()=> void;
}

export interface MyCouponCardEntities{
    passCondition: any;
    id : string;
    farmerId : string;
    promotionId : string;
    offlineCode? : string;
    used : boolean;
    createAt : string;
    updateAt : string;
    promotion : CouponCardEntities;
}
