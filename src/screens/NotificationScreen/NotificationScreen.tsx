import { 
    View, 
    Text, 
    SafeAreaView 
} from 'react-native'
import React from 'react'
import { stylesCentral } from '../../styles/StylesCentral'
import CustomHeader from '../../components/CustomHeader'
import NotificationCard from '../../components/NotificationCard/NotificationCard'
import * as RootNavigation from '../../navigations/RootNavigation';
import { NotificationType } from '../../entites/NotificationCard'
import { FCMtokenDatasource } from '../../datasource/FCMDatasource'
import { FlatList } from 'react-native-gesture-handler'

const monthArray = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  
  
const generateNotiTime = (date : string) => {
  const datetimesplit = date.split('T');
  const datesplit = datetimesplit[0].split('-')
  return `${datesplit[2]} ${monthArray[parseInt(datesplit[1]) - 1]} ${(parseInt(datesplit[0])+Number(543))%100}, ${parseInt(datetimesplit[1].split(':')[0]) + 7}:${datetimesplit[1].split(':')[1]}`;
};

function generateDataNotification(data : any){
    return data.map((item : any)=>{
        const type = item.type
        switch (type){
            case 'APPROVE_FARMER_SUCCESS' : 
            return {
                notificationType : NotificationType.VERIFY,
                expand : true,
                title : 'ยืนยันตัวตนสำเร็จ',
                isRead : item.isRead,
                subtitle : item.detail,
                dateString : generateNotiTime(item.createdAt),
                notiId : item.id
            }
            case 'APPROVE_FARMER_FAIL' : 
            return {
                notificationType : NotificationType.VERIFY,
                expand : true,
                title : 'ยืนยันตัวตนไม่สำเร็จ',
                isRead : item.isRead,
                subtitle : item.detail,
                dateString : generateNotiTime(item.createdAt),
                notiId : item.id
            }
            case 'APPROVE_FARMER_PLOT_SUCCESS' : 
            return {
                notificationType : NotificationType.VERIFY,
                expand : true,
                title : 'ยืนยันแปลงสำเร็จ',
                isRead : item.isRead,
                subtitle : item.detail,
                dateString : generateNotiTime(item.createdAt),
                notiId : item.id
            }
            case 'APPROVE_FARMER_PLOT_FAIL' : 
            return {
                notificationType : NotificationType.VERIFY,
                expand : true,
                title : 'ยืนยันแปลงไม่สำเร็จ',
                isRead : item.isRead,
                subtitle : item.detail,
                dateString : generateNotiTime(item.createdAt),
                notiId : item.id
            }
        }
    })
}

const readIt = (notiId : string) =>{
    FCMtokenDatasource.readNotification(notiId).then(
        res => RootNavigation.navigate('Main', {
            screen: 'ProfileScreen',
            params : {noti : true}
          })
    ).catch(err=> console.log(err))
}

const NotificationScreen : React.FC<any> = ({navigation,route}) => {
  const data = route.params.data;
  return (
    <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
            title="การแจ้งเตือน"
            showBackBtn
            onPressBack={() => navigation.goBack()}
        />
        <FlatList
           data={generateDataNotification(data)}
           renderItem={({item}: any) => (
            <NotificationCard 
              expand={item.expand}
              title={item.title}
              notificationType={item.notificationType}
              isRead={item.isRead}
              subtitle={item.subtitle}
              dateString={item.dateString}
              onClick={()=>{
                  readIt(item.notiId)
              }}
            />
           )}
        />
    </SafeAreaView>
  );
};

export default NotificationScreen;
