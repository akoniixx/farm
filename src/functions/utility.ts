import {Linking, Platform} from 'react-native';
import {io} from 'socket.io-client';
import {BASE_URL} from '../config/develop-config';
import {callcenterNumber} from '../definitions/callCenterNumber';

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
