import { faCalendar, faList, faLocationArrow, faPhone, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { normalize } from "@rneui/themed"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, image, icons } from "../../assets"
import fonts from "../../assets/fonts"
import TaskMenu from "../../components/TaskList/tasklist"
import { TaskDatasource } from "../../datasource/TaskDatasource"
import TaskTapNavigator from "../../navigations/topTabs/TaskTapNavigator"
import { stylesCentral } from "../../styles/StylesCentral"

const TaskScreen:React.FC = () =>{
    const [data,setData] = useState<any>([])
    const [page,setPage] = useState(1);
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        const getData = async()=>{
            setLoading(false);
            const droner_id = await AsyncStorage.getItem('droner_id')??""
            TaskDatasource.getTaskById(droner_id,["WAIT_START","IN_PROGRESS"],page,4).then((res)=>{
                setData(data.concat(res))
            }).catch(err => console.log(err))
        }
        getData();
    },[loading,page])
    return (
    (data.length != 0)?
    <View style={[{flex:1,backgroundColor:colors.grayBg,padding : 8}]}>
        <FlatList 
            onEndReached={()=>{
                setLoading(true);
                setPage(page +1);
            }}
            keyExtractor={(element)=> element.item.id}
            data={data}
            renderItem={({ item }:any) => (
                <TaskMenu 
                    id={item.item.taskNo}
                    status={item.item.status}
                    title={(item.item.purposeSpray != null)?item.item.purposeSpray.crop.cropName:"นาข้าว"}
                    price={item.item.totalPrice}
                    date={item.item.dateAppointment}
                    address={item.item.farmerPlot.landmark}
                    distance={item.item.distance}
                    user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                    img={item.image_profile_url}
                    preparation={item.item.preparationBy}
                />
            )}
        />
    </View>:
    <View style={[stylesCentral.center,{flex:1,backgroundColor:colors.grayBg,padding : 8}]}>
        <Image source={image.blankTask} style={{width:normalize(136),height:normalize(111)}} />
        <Text style={stylesCentral.blankFont}>ยังไม่มีงานที่ต้องทำ</Text>
    </View>
    
     )
}
export default TaskScreen
