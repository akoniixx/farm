import React from "react";
import { normalize } from "@rneui/themed"
import fonts from "../../assets/fonts"
import { colors, image, icons } from "../../assets"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { numberWithCommas } from "../../function/utility";
import * as RootNavigation from '../../navigations/RootNavigation';

const TaskMenu:React.FC<any> = (props : any)=>{
    const date = new Date(props.date)
    const call = (tel:string) => {
        props.setTel(tel)
        props.callFunc()
    }
    return <TouchableOpacity onPress={()=>RootNavigation.navigate('Main', {
        screen: 'TaskDetailScreen',
        params: {taskId: props.taskId}
      })}>
    <View style={styles.taskMenu}>
        <View style={styles.listTile}>
            <Text style={{
                fontFamily : fonts.medium,
                fontSize : normalize(14),
                color : '#9BA1A8'
            }}>#{props.id}</Text>
            <View style={{
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center',
                backgroundColor : (props.status === "WAIT_START")?'#D1F4FF':'#FCE588',
                paddingHorizontal : normalize(12),
                paddingVertical : normalize(5),
                borderRadius : normalize(12)
            }}>
                <Text style={{
                    fontFamily : fonts.medium,
                    color : (props.status === "WAIT_START")?'#0B69A3':'#B16F05',
                    fontSize : normalize(12)
                }}>{(props.status === "WAIT_START")?"รอเริ่มงาน":"กำลังดำเนินการ"}</Text>
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
            }}>฿ {props.price? numberWithCommas(props.price): null}</Text>
        </View>
        <View style={{
            display : 'flex',
            alignItems : 'center',
            flexDirection : 'row',
            paddingVertical : normalize(5),
        }}>
            <Image source={icons.jobCard} style={{
                width : normalize(20),
                height: normalize(20)
            }}/>
            <Text style={{
                fontFamily : fonts.medium,
                paddingLeft : normalize(8),
                fontSize : normalize(14),
                color: colors.fontBlack
            }}>{`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()+543},${date.getHours()}:${date.getMinutes()} น.`}</Text>
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
                }}>ระยะทาง {props.distance} กม.</Text>
            </View>
        </View>
        <View style={{
            display : 'flex',
            alignItems : 'center',
            flexDirection : 'row',
            paddingVertical : normalize(5)
        }}>
            <Image source={(typeof props.img !== "string")?icons.account:{uri : props.img}} style={{
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
            }}
            onPress ={()=>{
                call(props.tel)
            }}
            >
                <Image source={icons.calling} style={{
                    width : normalize(24),
                    height: normalize(24)
                }}/>
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
                backgroundColor : (props.status === "WAIT_START")?'#2BB0ED':'#2EC66E',
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Text style={{
                    fontFamily : fonts.medium,
                    fontWeight : "600",
                    fontSize : normalize(19),
                    color : '#fff'
                }}>{(props.status === "WAIT_START")?'เริ่มทำงาน':'งานเสร็จสิ้น'}</Text>
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
                }}>{props.preparation}</Text>
            </View>
        </View>
    </View>
    </TouchableOpacity> 
}

const styles = StyleSheet.create({
    taskMenu : {
      backgroundColor : '#fff',
      padding : normalize(15),
      marginVertical: normalize(5)
    },
    listTile : {
      display : 'flex',
      flexDirection : 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
      paddingVertical : 5
    }
  })

export default TaskMenu