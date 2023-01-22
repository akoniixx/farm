import { normalize } from "@rneui/themed";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, icons } from "../../assets";
import fonts from "../../assets/fonts";
import { dialCall } from "../../functions/utility";

interface props {
    name: string,
    profile: string,
    telnumber: string
}

export const FarmerCard: React.FC<props> = ({
    name,
    profile,
    telnumber
}) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',paddingVertical:10 ,borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.disable }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Image source={profile ? profile : icons.avatar} style={{ width: normalize(56), height: normalize(56), borderRadius: 50,marginRight:normalize(10) }} />
                <Text style={styles.name}>{name}</Text>
            </View>
            <TouchableOpacity  onPress={() => dialCall(telnumber)}>
                <Image source={profile?profile:icons.telephon} style={{ width: normalize(40), height: normalize(40) }} />
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create({
    name: {
      fontFamily: fonts.SarabunMedium,
      fontSize: normalize(18),
      color:colors.fontBlack
    }
  });