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
import TaskTapNavigator from "../../navigations/topTabs/TaskTapNavigator"
import { stylesCentral } from "../../styles/StylesCentral"

interface TaskMenuParam{
    id : String,
    status : String,
    title : String,
    price : number,
    date : String,
    address : String,
    distance : number,
    user : String
}
const listTask = [
    {
        id : "#13425",
        status : "กำลังดำเนินการ",
        title : "ฆ่าหญ้า (นาข้าว) | 100 ไร่",
        price : 14800,
        date : "23/08/2565,13:00 น.",
        address : "สวนพริกไทย/ เมืองปทุมธานี/ ปทุมธานี",
        distance : 1.2,
        user : "สมศรี มีนามาก"
    },
    // {
    //     id : "#13425",
    //     status : "กำลังดำเนินการ",
    //     title : "ฆ่าหญ้า (นาข้าว) | 100 ไร่",
    //     price : 14800,
    //     date : "23/08/2565,13:00 น.",
    //     address : "สวนพริกไทย/ เมืองปทุมธานี/ ปทุมธานี",
    //     distance : 1.2,
    //     user : "สมศรี มีนามาก"
    // },
    // {
    //     id : "#13425",
    //     status : "กำลังดำเนินการ",
    //     title : "ฆ่าหญ้า (นาข้าว) | 100 ไร่",
    //     price : 14800,
    //     date : "23/08/2565,13:00 น.",
    //     address : "สวนพริกไทย/ เมืองปทุมธานี/ ปทุมธานี",
    //     distance : 1.2,
    //     user : "สมศรี มีนามาก"
    // },
]
const TaskMenu:React.FC<TaskMenuParam> = (props : any)=>{
    return <View style={styles.taskMenu}>
        <View style={styles.listTile}>
            <Text style={{
                fontFamily : fonts.medium,
                fontSize : normalize(14),
                color : '#9BA1A8'
            }}>{props.id}</Text>
            <View style={{
                width : normalize(102),
                height : normalize(24),
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center',
                backgroundColor : '#FCE588',
                borderRadius : normalize(12)
            }}>
                <Text style={{
                    fontFamily : fonts.medium,
                    color : '#B16F05',
                    fontSize : normalize(12)
                }}>{props.status}</Text>
            </View>
        </View>
        <View style={styles.listTile}>
            <Text style={{
                fontFamily : fonts.medium,
                fontSize : normalize(19)
            }}>{props.title}</Text>
            <Text style={{
                fontFamily : fonts.medium,
                color : '#2EC66E',
                fontSize : normalize(17)
            }}>฿ {props.price}</Text>
        </View>
        <View style={{
            display : 'flex',
            alignItems : 'center',
            flexDirection : 'row',
            paddingVertical : normalize(5)
        }}>
            <Image source={icons.jobCard} style={{
                width : normalize(20),
                height: normalize(20)
            }}/>
            <Text style={{
                fontFamily : fonts.medium,
                paddingLeft : normalize(8),
                fontSize : normalize(14),
            }}>{props.date}</Text>
        </View>
        <View style={{
            display : 'flex',
            flexDirection : 'row',
            paddingVertical : normalize(5)
        }}>
            <Image source={icons.jobDistance} style={{
                width : normalize(20),
                height: normalize(20)
            }}/>
            <View style={{
                paddingLeft : normalize(8),
            }}>
                <Text style={{
                    fontFamily : fonts.medium,
                    fontSize : normalize(14),
                }}>{props.address}</Text>
                <Text style={{
                    fontFamily : fonts.medium,
                    color : '#9BA1A8',
                    fontSize : normalize(13),
                }}>ระยะทาง {props.length} กม.</Text>
            </View>
        </View>
        <View style={{
            display : 'flex',
            alignItems : 'center',
            flexDirection : 'row',
            paddingVertical : normalize(5)
        }}>
            <Image source={icons.account} style={{
                width : normalize(20),
                height: normalize(20)
            }}/>
            <Text style={{
                fontFamily : fonts.medium,
                paddingLeft : normalize(8),
                fontSize : normalize(14),
            }}>{props.user}</Text>
        </View>
        <View style={{
            display : 'flex',
            justifyContent : 'space-between',
            alignItems : 'center',
            flexDirection : 'row',
            paddingVertical : normalize(10)
        }}>
            <TouchableOpacity style={{
                width : normalize(49),
                height : normalize(49),
                borderRadius : normalize(8),
                borderWidth : 0.5,
                borderColor : 'grey',
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <FontAwesomeIcon icon={faPhone} size={20}/>
            </TouchableOpacity>
            <TouchableOpacity style={{
                width : normalize(127.5),
                height : normalize(49),
                borderRadius : normalize(8),
                backgroundColor : '#FB8705',
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Text style={{
                    fontFamily : fonts.medium,
                    fontWeight : "600",
                    fontSize : normalize(19),
                    color : '#fff'
                }}>ขยายเวลา</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                width : normalize(127.5),
                height : normalize(49),
                borderRadius : normalize(8),
                backgroundColor : '#2EC66E',
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Text style={{
                    fontFamily : fonts.medium,
                    fontWeight : "600",
                    fontSize : normalize(19),
                    color : '#fff'
                }}>งานเสร็จสิ้น</Text>
            </TouchableOpacity>
        </View>
        <View style={{
            display : 'flex',
            alignItems : 'center',
            flexDirection : 'row',
            paddingVertical : normalize(5)
        }}>
            <Image source={icons.note} style={{
                width : normalize(20),
                height: normalize(20)
            }}/>
            <View style={{
                paddingLeft : normalize(8)
            }}>
                <Text style={{
                    fontFamily : fonts.medium,
                    fontSize : normalize(14),
                }}>เตรียมยาให้ด้วย</Text>
            </View>
        </View>
    </View>
}

const TaskScreen:React.FC = () =>{
    const [data,setData] = useState([])
    useEffect(()=>{
        const getData = async()=>{
            const token = await AsyncStorage.getItem('token')
            const droner_id = await AsyncStorage.getItem('droner_id')
            console.log(`https://api-dev-dnds.iconkaset.com/tasks/task/task-droner?dronerId=${droner_id}&taskStatus=WAIT_START&taskStatus=IN_PROGRESS&page=1&take=5`)
            console.log(`Bearer ${token}`)
            axios.post(`https://api-dev-dnds.iconkaset.com/tasks/task/task-droner?dronerId=${droner_id}&taskStatus=WAIT_START&taskStatus=IN_PROGRESS&page=1&take=5`,{
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            }).then((res)=>{
                setData(res.data)
            }).catch(err=> console.log(err))
        }
        getData();
    },[])
    return (
    (data.length != 0)?
    <View style={[{flex:1,backgroundColor:colors.grayBg,padding : 8}]}>
        <FlatList 
            keyExtractor={(item)=> item.id}
            data={listTask}
            renderItem={({item})=>(
                <TaskMenu
                id={item.id}
                status={item.status}
                price={item.price}
                date={item.date}
                address={item.address}
                distance={item.distance}
                title={item.title}
                user={item.user}
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

const styles = StyleSheet.create({
  taskMenu : {
    backgroundColor : '#fff',
    padding : 15
  },
  listTile : {
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    paddingVertical : 5
  }
})