import {Linking, Platform} from 'react-native';
import { callcenterNumber } from '../definitions/callCenterNumber';

export const numberWithCommas = (number: string) => {
 let nub = parseFloat(number).toFixed(2)
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

export const decimalConvert = (string:string) =>(
  String(parseFloat(string).toFixed(2))
)