import { Text } from '@rneui/base';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { mixpanel } from '../../../mixpanel';
import { colors, font, icons } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import DatePickerCustom from '../../components/Calendar/Calendar';
import StepIndicatorHead from '../../components/StepIndicatorHead';
import TimePicker from '../../components/TimePicker/TimePicker';
import { useAutoBookingContext } from '../../contexts/AutoBookingContext';
import { normalize, width } from '../../functions/Normalize';
import { momentExtend } from '../../utils/moment-buddha-year';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeadDronerCardForCreatTask from '../../components/HeadDronerCardForCreatTask';

const SelectDateScreen: React.FC<any> = ({ navigation, route }) => {
  const isSelectDroner = route.params.isSelectDroner;
  const profile = route.params.profile;
  const {
    state: { taskData },
    autoBookingContext: { setTaskData, setPlotDisable },
  } = useAutoBookingContext();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [date, setDate] = useState(
    moment().add(1, 'days').startOf('day').toDate(),
  );
  const [openTimePicker, setopenTimePicker] = useState(false);
  const [note, setNote] = useState('');
  const [hour, setHour] = useState(6);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (taskData.dateAppointment) {
      const dateAppointment = new Date(taskData.dateAppointment);
      setDate(dateAppointment);
      setHour(dateAppointment.getHours());
      setMinute(dateAppointment.getMinutes());
    }
    setPlotDisable([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = () => {
    const newFormatDate = moment(date)
      .set('hour', hour)
      .set('minute', minute)
      .toISOString();
    setTaskData(prev => ({
      ...prev,
      dateAppointment: newFormatDate,
      comment: note,
    }));

    navigation.navigate('SelectPlotScreen', {
      isSelectDroner: isSelectDroner,
      profile: profile,
    });
  };
  return (
    <>
      <StepIndicatorHead
        curentPosition={0}
        onPressBack={() => {
          mixpanel.track('Tab back from select date screen');
          navigation.goBack();
        }}
        label={'เลือกวันและเวลาฉีดพ่น'}
      />
      {isSelectDroner && (
        <HeadDronerCardForCreatTask
          navigation={navigation}
          image={profile.image_droner}
          name={profile.firstname + ' ' + profile.lastname}
        />
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: 24,
            paddingTop: 16,
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text style={styles.label}>วันที่ฉีดพ่น</Text>
              <TouchableOpacity
                style={{
                  marginBottom: 8,
                }}
                onPress={() => setOpenCalendar(true)}>
                <View
                  style={[
                    styles.input,
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <TextInput
                    value={momentExtend.toBuddhistYear(date, 'DD MMMM YYYY')}
                    editable={false}
                    placeholder={'ระบุวัน เดือน ปี'}
                    placeholderTextColor={colors.disable}
                    style={{
                      color: colors.fontBlack,

                      fontSize: normalize(20),
                      fontFamily: font.SarabunLight,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />

                  <Image
                    source={icons.calendar}
                    style={{
                      width: normalize(24),
                      height: normalize(24),
                    }}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.label}>เวลา</Text>
              <TouchableOpacity
                style={{
                  marginBottom: 8,
                }}
                onPress={() => setopenTimePicker(true)}>
                <View
                  style={[
                    styles.input,
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <TextInput
                    value={
                      ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2)
                    }
                    editable={false}
                    placeholder={'ระบุวัน เดือน ปี'}
                    placeholderTextColor={colors.disable}
                    style={{
                      color: colors.fontBlack,
                      fontSize: normalize(20),
                      fontFamily: font.SarabunLight,

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                  <Image
                    source={icons.time}
                    style={{
                      width: normalize(24),
                      height: normalize(24),
                    }}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 16,
                }}>
                <Text
                  style={[
                    styles.label,
                    {
                      marginTop: 0,
                      marginRight: 8,
                    },
                  ]}>
                  หมายเหตุ
                </Text>
                <Text
                  style={{
                    color: colors.grey30,
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(20),
                  }}>
                  (ไม่จำเป็นต้องระบุ)
                </Text>
              </View>
              <TextInput
                scrollEnabled={false}
                numberOfLines={6}
                onChangeText={t => {
                  setNote(t);
                }}
                value={note}
                returnKeyType="done"
                multiline
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  mixpanel.track('Tab set note booking');
                  const newNote = note.replace(/(\r\n|\n|\r)/gm, '');
                  setNote(newNote);
                  Keyboard.dismiss();
                }}
                placeholder={'ระบุข้อมูลแจ้งนักบิน'}
                placeholderTextColor={colors.grey30}
                style={{
                  width: '100%',
                  color: colors.fontBlack,
                  fontSize: normalize(20),
                  fontFamily: font.SarabunLight,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderColor: colors.disable,
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderRadius: 8,
                  textAlignVertical: 'top',
                  writingDirection: 'ltr',
                  height: Platform.OS === 'ios' ? 6 * 20 : 120,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <MainButton
                label="ยกเลิก"
                fontColor={colors.fontBlack}
                borderColor={colors.fontGrey}
                color={colors.white}
                width={Dimensions.get('window').width * 0.47 - 16}
                onPress={() => navigation.goBack()}
              />
              <MainButton
                label="บันทึก"
                fontColor={colors.white}
                color={colors.greenLight}
                width={Dimensions.get('window').width * 0.47 - 16}
                onPress={() => onSubmit()}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
                {
                  textAlign: 'center',
                  color: colors.fontBlack,
                },
              ]}>
              วันที่ฉีดพ่น
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: colors.greenLight,
                fontFamily: font.SarabunLight,
                fontSize: normalize(18),
                marginTop: normalize(4),

                lineHeight: normalize(30),
              }}>
              เลื่อนขึ้นลงเพื่อเลือกวันฉีดพ่น
            </Text>
            <View>
              <DatePickerCustom
                value={date}
                startDate={moment().add(1, 'days').startOf('day').toDate()}
                startYear={moment().get('year') + 543}
                endYear={moment().add(1, 'year').get('year') + 543}
                onHandleChange={(d: Date) => {
                  setDate(d);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <MainButton
                label="ยกเลิก"
                fontColor={colors.fontBlack}
                borderColor={colors.fontGrey}
                color={colors.white}
                width={Dimensions.get('window').width * 0.45 - 32}
                onPress={() => {
                  mixpanel.track('Tab cancel calendar');
                  setOpenCalendar(false);
                }}
              />
              <MainButton
                label="บันทึก"
                fontColor={colors.white}
                color={colors.greenLight}
                width={Dimensions.get('window').width * 0.45 - 32}
                onPress={() => {
                  mixpanel.track('Tab submit calendar');
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
                {
                  textAlign: 'center',
                  color: colors.fontBlack,
                },
              ]}>
              เวลาที่ฉีดพ่น
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: colors.greenLight,
                fontFamily: font.SarabunLight,
                fontSize: normalize(18),
                marginTop: normalize(4),
                lineHeight: normalize(30),
              }}>
              เลื่อนขึ้นลงเพื่อเลือกเวลาฉีดพ่น
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingVertical: normalize(20),
              }}>
              <TimePicker
                setHour={(h: number) => {
                  setHour(h);
                }}
                setMinute={(m: number) => {
                  setMinute(m);
                }}
                hour={hour}
                minute={minute}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <MainButton
                label="ยกเลิก"
                fontColor={colors.fontBlack}
                borderColor={colors.fontGrey}
                color={colors.white}
                width={Dimensions.get('window').width * 0.45 - 32}
                onPress={() => {
                  mixpanel.track('Tab cancel time picker');
                  setopenTimePicker(false);
                }}
              />
              <MainButton
                label="บันทึก"
                fontColor={colors.white}
                color={colors.greenLight}
                width={Dimensions.get('window').width * 0.45 - 32}
                onPress={() => {
                  mixpanel.track('Tab submit time picker');
                  setopenTimePicker(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default SelectDateScreen;

const styles = StyleSheet.create({
  label: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(20),
    color: colors.fontBlack,
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    fontFamily: font.SarabunLight,
    height: normalize(56),
    paddingHorizontal: 16,
    borderColor: colors.grey20,
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
});
