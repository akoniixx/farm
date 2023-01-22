import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { colors, font, icons } from "../../assets";
import fonts from "../../assets/fonts";
import { normalize } from "../../functions/Normalize";
import { getStatusToText } from "../../functions/utility";
import { FarmerCard } from "./FarmerCard";

interface taskListProps {
    task: {
        task_no: string,
        status: string,
        total_price: string,
        plant_name: string,
        target_spray: Array<string>,
        date_appointment: string,
        plot_name: string,
        rai_amount: string,
        droner: {
            image_profile: string,
            firstname: string,
            lastname: string,
            telephone_no: string
        }
    }
}

export const CardTask: React.FC<taskListProps> = ({ task }) => {
    return (
        <View style={{ backgroundColor: 'white', padding: 10, marginVertical: normalize(10) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={styles.statusNo}>{task.task_no}</Text>
                </View>

                <View style={{
                    backgroundColor: getStatusToText(task.status)?.bgcolor,
                    borderColor: getStatusToText(task.status)?.border,
                    borderWidth: 1,
                    borderRadius: 18,
                    paddingVertical: normalize(5),
                    paddingHorizontal: normalize(10),

                }}>
                    <Text style={{
                        fontFamily: fonts.AnuphanMedium,
                        fontSize: normalize(16),
                        color: getStatusToText(task.status)?.color,






                    }}>{getStatusToText(task.status)?.label}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: normalize(10) }}>
                <Text style={styles.plant}>{task.plant_name} {task.target_spray.map((d: string) => (
                    '|' + ' ' + d
                ))} </Text>
                <Text style={styles.price}>{task.total_price + ' ' + 'บาท'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(10) }}>
                <Image source={icons.calendarGreen} style={{ width: normalize(15), height: normalize(17), marginRight: normalize(10) }} />
                <Text style={styles.plot}>23123</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(10) }}>
                <Image source={icons.plotGreen} style={{ width: normalize(15), height: normalize(17), marginRight: normalize(10) }} />
                <Text style={styles.plot}>{task.plot_name + ', ' + task.rai_amount + ' ไร่'}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <FarmerCard name={task.droner.firstname + ' ' + task.droner.lastname} profile={task.droner.image_profile} telnumber={task.droner.telephone_no} />
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    statusNo: {
        fontFamily: fonts.AnuphanMedium,
        fontSize: normalize(14),
        color: '#8D96A0'
    },
    price: {
        fontFamily: fonts.AnuphanMedium,
        fontSize: normalize(20),
        color: '#2EC46D'
    },
    plant: {
        fontFamily: fonts.AnuphanMedium,
        fontSize: normalize(20),
        color: colors.fontBlack
    },
    plot: {
        fontFamily: fonts.SarabunLight,
        fontSize: normalize(18),
        color: colors.fontBlack
    }
});