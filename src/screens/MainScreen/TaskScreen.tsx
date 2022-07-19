import { normalize } from "@rneui/themed"
import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, image } from "../../assets"
import TaskTapNavigator from "../../navigations/topTabs/TaskTapNavigator"
import { stylesCentral } from "../../styles/StylesCentral"

const TaskScreen:React.FC = () =>{
    return (
        

    <View style={[stylesCentral.center,{flex:1,backgroundColor:colors.grayBg}]}>
        <Image source={image.blankTask} style={{width:normalize(136),height:normalize(111)}} />
       
    <Text style={stylesCentral.blankFont}>ยังไม่มีงานที่ต้องทำ</Text>
    </View>
    

        
    )
}
export default TaskScreen

const styles = StyleSheet.create({
  

})