import { Text } from '@rneui/base';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import DatePickerCustom from '../../components/Calendar/Calendar';
import CustomHeader from '../../components/CustomHeader';
import StepIndicatorHead from '../../components/StepIndicatorHead';
import TimePicker from '../../components/TimePicker/TimePicker';
import { height, normalize, width } from '../../functions/Normalize';



const SelectDateScreen: React.FC<any> = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const [openCalendar, setOpenCalendar] = useState(false);
    const [date, setDate] = useState(new Date());
    const [openTimePicker, setopenTimePicker] = useState(false);
    const [note, setNote] = useState('');
    return (
        <>
            <StepIndicatorHead
                curentPosition={0}
                onPressBack={() => navigation.goBack()}
                label={'เลือกวันและเวลาฉีดพ่น'}
            />

            <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }} >
                <View style={{flex:1,justifyContent:'space-between'}}>
                    <View>
                        <Text style={styles.label}>วันที่ฉีดพ่น</Text>
                        <TouchableOpacity onPress={() => setOpenCalendar(true)}>
                            <View
                                style={[
                                    styles.input,
                                    {
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    },
                                ]}>
                                <TextInput
                                    value={date.toLocaleDateString('th-TH', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                    editable={false}
                                    placeholder={'ระบุวัน เดือน ปี'}
                                    placeholderTextColor={colors.disable}
                                    style={{
                                        width: windowWidth * 0.78,
                                        color: colors.fontBlack,
                                        fontSize: normalize(16),
                                        fontFamily: font.SarabunLight,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                />
                                <Image
                                    source={icons.calendar}
                                    style={{
                                        width: normalize(25),
                                        height: normalize(30),
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label}>เวลา</Text>
                        <TouchableOpacity onPress={() => setopenTimePicker(true)}>
                            <View
                                style={[
                                    styles.input,
                                    {
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    },
                                ]}>
                                <TextInput
                                    value={
                                        '10:10'
                                    }
                                    editable={false}
                                    placeholder={'ระบุวัน เดือน ปี'}
                                    placeholderTextColor={colors.disable}
                                    style={{
                                        width: windowWidth * 0.78,
                                        color: colors.fontBlack,
                                        fontSize: normalize(16),
                                        fontFamily: font.SarabunLight,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                />
                                <Image
                                    source={icons.time}
                                    style={{
                                        width: normalize(25),
                                        height: normalize(30),
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label}>หมายเหตุ (ไม่มีก็ได้)
                        </Text>

                        <View
                            style={[
                                styles.input,
                                {
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                },
                            ]}>
                            <TextInput
                                numberOfLines={6}
                                multiline
                                onChangeText={setNote}
                                value={note}
                                placeholder={'ระบุข้อมูลแจ้งนักบิน'}
                                placeholderTextColor={colors.disable}
                                style={{
                                    width: windowWidth * 0.78,
                                    color: colors.fontBlack,
                                    fontSize: normalize(16),
                                    fontFamily: font.SarabunLight,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10,
                                    height: 50
                                }}
                            />

                        </View>
                    </View>


                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <MainButton
                            label="ยกเลิก"
                            fontColor={colors.fontBlack}
                            borderColor={colors.fontGrey}
                            color={colors.white}
                            width={150}
                            onPress={() => navigation.goBack()}
                        />
                        <MainButton
                            label="บันทึก"
                            fontColor={colors.white}
                            color={colors.greenLight}
                            width={150}
                            onPress={() => navigation.navigate('SelectPlotScreen')}
                        />
                    </View>
                </View>


            </SafeAreaView>
            <Modal transparent={true} visible={openCalendar}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            padding: normalize(20),
                            backgroundColor: colors.white,
                            width: width * 0.9,
                            display: 'flex',
                            justifyContent: 'center',
                            borderRadius: normalize(8),
                        }}>
                        <Text
                            style={[
                                styles.h1,
                                { textAlign: 'center', bottom: '5%', color: colors.fontBlack },
                            ]}>
                            วันที่ฉีดพ่น
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.greenLight,
                                fontFamily: font.SarabunLight,
                                fontSize: normalize(16),
                            }}>
                            เลื่อนขึ้นลงเพื่อเลือกวันฉีดพ่น
                        </Text>
                        <View>

                            <DatePickerCustom
                                value={date}
                                onHandleChange={(d: Date) => {
                                    setDate(d)
                                }}
                            />
                        </View>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <MainButton
                                label="ยกเลิก"
                                fontColor={colors.fontBlack}
                                borderColor={colors.fontGrey}
                                color={colors.white}
                                width={150}
                                onPress={() => setOpenCalendar(false)}
                            />
                            <MainButton
                                label="บันทึก"
                                fontColor={colors.white}
                                color={colors.greenLight}
                                width={150}
                                onPress={() => {
                                    setOpenCalendar(false);
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal transparent={true} visible={openTimePicker}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            padding: normalize(20),
                            backgroundColor: colors.white,
                            width: width * 0.9,
                            display: 'flex',
                            justifyContent: 'center',
                            borderRadius: normalize(8),
                        }}>
                        <Text
                            style={[
                                styles.h1,
                                { textAlign: 'center', bottom: '5%', color: colors.fontBlack },
                            ]}>
                            วันที่ฉีดพ่น
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.greenLight,
                                fontFamily: font.SarabunLight,
                                fontSize: normalize(16),
                            }}>
                            เลื่อนขึ้นลงเพื่อเลือกวันฉีดพ่น
                        </Text>
                        <View>
                            <TimePicker />

                        </View>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <MainButton
                                label="ยกเลิก"
                                fontColor={colors.fontBlack}
                                borderColor={colors.fontGrey}
                                color={colors.white}
                                width={150}
                                onPress={() => setopenTimePicker(false)}
                            />
                            <MainButton
                                label="บันทึก"
                                fontColor={colors.white}
                                color={colors.greenLight}
                                width={150}
                                onPress={() => {
                                    setOpenCalendar(false);
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}
export default SelectDateScreen

const styles = StyleSheet.create({
    label: {
        fontFamily: font.AnuphanMedium,
        fontSize: normalize(20),
        color: colors.fontBlack,
    },
    input: {
        fontFamily: font.SarabunLight,
        height: normalize(56),
        marginVertical: 12,
        padding: 5,
        borderColor: colors.disable,
        borderWidth: 1,
        borderRadius: normalize(10),
        color: colors.fontBlack,
        fontSize: normalize(16),
    },
    h1: {
        fontFamily: font.AnuphanBold,
        fontSize: normalize(20),
        color: colors.greenLight,
    },
})

