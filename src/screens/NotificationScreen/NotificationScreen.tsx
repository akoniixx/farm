import { 
    View, 
    Text, 
    SafeAreaView 
} from 'react-native'
import React from 'react'
import { stylesCentral } from '../../styles/StylesCentral'
import CustomHeader from '../../components/CustomHeader'
import NotificationCard from '../../components/NotificationCard/NotificationCard'
import { NotificationType } from '../../entites/NotificationCard'

const NotificationScreen : React.FC<any> = ({navigation}) => {
  return (
    <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
            title="การแจ้งเตือน"
            showBackBtn
            onPressBack={() => navigation.goBack()}
        />
        <NotificationCard 
            expand={true}
            title={"แจ้งงาน"}
            notificationType={NotificationType.TASK}
            isRead={true}
            subtitle={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi sint, assumenda ipsum, voluptatem facilis voluptas beatae aperiam reprehenderit maxime rerum laudantium praesentium possimus vel ex enim! Inventore voluptatum quia aspernatur."}
            dateString={"6 ม.ค. 66,18.01 น."}
            onClick={()=>{

            }}
        />
        <NotificationCard 
            expand={true}
            title={"แจ้งงาน"}
            notificationType={NotificationType.VERIFY}
            isRead={false}
            subtitle={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi sint, assumenda ipsum, voluptatem facilis voluptas beatae aperiam reprehenderit maxime rerum laudantium praesentium possimus vel ex enim! Inventore voluptatum quia aspernatur."}
            dateString={"6 ม.ค. 66,18.01 น."}
            onClick={()=>{

            }}
        />
    </SafeAreaView>
  )
}

export default NotificationScreen;