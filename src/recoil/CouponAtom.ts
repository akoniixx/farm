import { atom } from 'recoil';

export const couponState = atom({
  key: 'coupon',
  default: {
    id: '',
    promotionId: '',
    name: '',
    couponCode: '',
    promotionType: 'ONLINE',
    discountType: 'DISCOUNT',
    discount: 0,
    netPrice: 0,
    err: '',
  },
});
