import { normalize } from "@rneui/themed"
import React from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "../../assets"
import { stylesCentral } from "../../styles/StylesCentral"

const InprogressTask:React.FC = () =>{
    return (
        <View style={stylesCentral.containerSubScreen}>
            <Text>
            inprogress
            </Text>
        </View>
    )
}
export default InprogressTask