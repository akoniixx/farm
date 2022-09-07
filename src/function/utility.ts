import { Linking, Platform } from "react-native";

export const numberWithCommas = (number:number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const dialCall = (number?: string) => {
    let telNumber = number ?  number:'0864968126'
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${telNumber}`;
    } else {
      phoneNumber = `telprompt:${telNumber}`;
    }
    Linking.openURL(phoneNumber);
  };

 export const getStatusToText = (status:string) =>{
    switch (status) {
      case 'WAIT_START':
        return {label:'รอเริ่มงาน',bgcolor:'#D1F4FF',color:'#0B69A3'}
        break;
      case 'IN_PROGRESS':
        return{label:'กำลังดำเนินการ',bgcolor:'#FCE588',color:'#B16F05'}
         break;
         case 'DONE':
          return{label:'งานเสร็จสิ้น',bgcolor:'#9BF9D3',color:'#014D40'}
           break;
    }
  }