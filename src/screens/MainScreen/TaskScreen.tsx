import { normalize } from "@rneui/themed"
import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, image } from "../../assets"
import TaskTapNavigator from "../../navigations/topTabs/TaskTapNavigator"
import { stylesCentral } from "../../styles/StylesCentral"

const TaskMenu:React.FC = ()=>{
    return <View style={styles.taskMenu}>
        <View style={styles.listTile}>
            <Text>#13425</Text>
            <Text>งานใหม่</Text>
        </View>
        <View style={styles.listTile}>
            <Text>ฆ่าหญ้า (นาข้าว) | 100 ไร่</Text>
            <Text>฿14,800</Text>
        </View>
    </View>
}

const TaskScreen:React.FC = () =>{
    return (
        

    <View style={[{flex:1,backgroundColor:colors.grayBg,padding : 4}]}>
        <TaskMenu />
        {/* <Image source={image.blankTask} style={{width:normalize(136),height:normalize(111)}} />
       
    <Text style={stylesCentral.blankFont}>ยังไม่มีงานที่ต้องทำ</Text> */}
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