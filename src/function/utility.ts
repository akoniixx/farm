import {Linking, Platform} from 'react-native';
import {io} from 'socket.io-client';
import {BASE_URL} from '../config/develop-config';
import {callcenterNumber} from '../definitions/callCenterNumber';
import moment from 'moment';

export const numberWithCommas = (number: string, withOutToFix = false) => {
  let nub = parseFloat(number).toFixed(withOutToFix ? 0 : 2);
  return nub.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const dialCall = (number?: string) => {
  let telNumber = number ? number : callcenterNumber;
  let phoneNumber = '';
  if (Platform.OS === 'android') {
    phoneNumber = `tel:${telNumber}`;
  } else {
    phoneNumber = `telprompt:${telNumber}`;
  }
  Linking.openURL(phoneNumber);
};

export const getStatusToText = (status: string) => {
  switch (status) {
    case 'WAIT_START':
      return {label: 'รอเริ่มงาน', bgcolor: '#D1F4FF', color: '#0B69A3'};
    case 'IN_PROGRESS':
      return {label: 'กำลังดำเนินการ', bgcolor: '#FCE588', color: '#B16F05'};
    case 'WAIT_REVIEW':
      return {label: 'งานเสร็จสิ้น', bgcolor: '#9BF9D3', color: '#014D40'};
    case 'CANCELED':
      return {label: 'ถูกยกเลิก', bgcolor: '#FFD7D7', color: '#AB091E'};
    case 'DONE':
      return {label: 'งานเสร็จสิ้น', bgcolor: '#9BF9D3', color: '#014D40'};
    case 'WAIT_RECEIVE':
      return {label: 'งานใหม่', bgcolor: '#FF981E', color: '#FFFFFF'};
  }
};

export const openGps = (lat: number, lng: number, name: string) => {
  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${lat},${lng}`;
  const label = name;
  const url = Platform.select({
    ios: `comgooglemaps://?center=${lat},${lng}&q=${lat},${lng}&zoom=15&views=traffic`,
    android: `${scheme}${latLng}(${label})`,
  });
  Linking.canOpenURL(url ? url : '')
    .then(supported => {
      if (!supported) {
        let browser_url = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`;
        return Linking.openURL(browser_url);
      } else {
        return Linking.openURL(url ? url : '');
      }
    })
    .catch(err => console.log('error', err));
};

export const decimalConvert = (string: string) =>
  String(parseFloat(string).toFixed(2));

export const socket = io(BASE_URL, {
  path: '/tasks/task/socket',
});

export const calTotalPrice = (totalprice: string, discount: string) => {
  let totalPrice = parseInt(totalprice) + parseInt(discount);
  let text = totalPrice.toString();
  return text;
};

export const calTotalPromotion = (p1: string, p2: string, p3: string) => {
  let totalPrice = parseInt(p1) + parseInt(p2) + parseInt(p3);
  let text = totalPrice.toString();
  return text;
};

export const momentExtend = {
  toBuddhistYear: (date: string | Date, format = 'DD MMMM YYYY') => {
    const christianYear = moment(date).format('YYYY');
    const buddhishYear = (parseInt(christianYear) + 543).toString();
    return moment(date)
      .format(
        format
          .replace('YYYY', buddhishYear)
          .replace('YY', buddhishYear.substring(2, 4)),
      )
      .replace(christianYear, buddhishYear);
  },
};
