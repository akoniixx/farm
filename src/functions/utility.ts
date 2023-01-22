import { Linking, Platform } from 'react-native';
import { io } from 'socket.io-client';
import { BASE_URL } from '../config/develop-config';
import { callcenterNumber } from '../definitions/callCenterNumber';

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

export const openGps = (lat: number, lng: number, name: string) => {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
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

export const getStatusToText = (status: string) => {
  switch (status) {
    case 'WAIT_START':
      return {label: 'รอเริ่มงาน', bgcolor: '#FB931D',border:'#FEDBB4', color: '#FFFFFF'};
    case 'IN_PROGRESS':
      return {label: 'กำลังฉีดพ่น', bgcolor: '#5FC1FC',border:'#BBE4FE',color: '#FFFFFF'};
    case 'WAIT_REVIEW':
      return {label: 'รอรีวิว', bgcolor: '#E8F6FF',border:'#8DD3FD', color: '#03649F'};
    case 'CANCELED':
      return {label: 'ถูกยกเลิก', bgcolor: '#FFD7D7',border: '#DE909A',color: '#AB091E'};
    case 'DONE':
      return {label: 'เสร็จสิ้น', bgcolor: '#B2FFE3',border:'#A1E9BF' ,color: '#1F8449'};
    case 'WAIT_RECEIVE':
      return {label: 'รอนักบินรับงาน', bgcolor: '#FFE26E',border:'#FFF5CC',color: '#B05E03'};
  }
};