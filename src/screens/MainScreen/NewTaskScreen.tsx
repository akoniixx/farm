import { normalize } from "@rneui/themed"
import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, image } from "../../assets"
import TaskTapNavigator from "../../navigations/topTabs/TaskTapNavigator"
import { stylesCentral } from "../../styles/StylesCentral"

const NewTaskScreen:React.FC = () =>{
    return (
        

    <View style={[stylesCentral.center,{flex:1,backgroundColor:colors.grayBg}]}>
        <Image source={image.blankNewTask} style={{width:normalize(136),height:normalize(111)}} />
       
       <View style={{paddingHorizontal:normalize(40)}}>
       <Text style={stylesCentral.blankFont}>ยังไม่มีงานใหม่ เนื่องจากคุณปิดรับงานอยู่ กรุณากดเปิดรับงานเพื่อที่จะไม่พลาดงานสำหรับคุณ!</Text>
       </View>
   
    </View>
    

        
    )
}
export default NewTaskScreen

const styles = StyleSheet.create({
  

})