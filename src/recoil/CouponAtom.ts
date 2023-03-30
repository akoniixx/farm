import { atom } from 'recoil'

export const couponState = atom({
    key : 'coupon',
    default : {
        id : "",
        name : "",
        discountType : "DISCOUNT",
        discount : 0
    }
})