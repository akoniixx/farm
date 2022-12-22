import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  PermissionsAndroid,
  Platform,
  Modal,
  Image,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image as img} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import {normalize, width} from '../../functions/Normalize';
import {ProgressBar} from '../../components/ProgressBar';
import {registerReducer} from '../../hook/registerfield';
import fonts from '../../assets/fonts';
import {Avatar} from '@rneui/themed';
import {LocaleConfig} from 'react-native-calendars';
import MyDatePicker from '../../components/Calendar/Calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import Schedule from '../../components/Calendar/Calendar';
import DatePickerCustom from '../../components/Calendar/Calendar';
import CustomCalendar from '../../components/Calendar/Calendar';
import TimePicker from '../../components/Calendar/Calendar';
import DatePicker from 'react-native-date-picker';
import {Register} from '../../datasource/AuthDatasource';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import { _monthName, build12Year } from '../../definitions/constants';

const FirstFormScreen: React.FC<any> = ({navigation, route}) => {
  const initialFormRegisterState = {
    name: '',
    surname: '',
    birthDate: '',
    tel: route.params.tele,
  };
  const tele = route.params.tele;
  const windowWidth = Dimensions.get('window').width;
  const [image, setImage] = useState<any>(null);
  const [value, setValue] = useState(null);
  const [birthday, setBirthday] = useState<any>();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
      setOpenModal(false);
    }
  }, [image]);

  const onCamera = useCallback(async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
      setOpenModal(false);
    }
  }, [image]);

  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนเกษตรกร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <View style={{marginBottom: normalize(10)}}>
            <ProgressBar index={1} />
          </View>
          <Text style={styles.h3}>ขั้นตอนที่ 1 จาก 4</Text>
          <Text style={styles.h1}>ระบุข้อมูลส่วนตัว</Text>
          <ScrollView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: normalize(40),
              }}>
              <TouchableOpacity onPress={() => setOpenModal(true)}>
                <View
                  style={{
                    width: normalize(116),
                    height: normalize(116),
                    position: 'relative',
                  }}>
                  <Avatar
                    size={116}
                    rounded
                    source={!image ? icons.avatar : {uri: image.assets[0].uri}}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      left: normalize(70.7),
                      top: normalize(70.7),
                      width: normalize(32),
                      height: normalize(32),
                      borderRadius: normalize(16),
                      backgroundColor: colors.white,
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={icons.camera}
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.head}>ชื่อ*</Text>
            <TextInput
              onChangeText={value => {
                dispatch({
                  type: 'Handle Input',
                  field: 'name',
                  payload: value,
                });
              }}
              value={formState.name}
              style={styles.input}
              editable={true}
              placeholder={'ระบุชื่อ'}
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>นามสกุล*</Text>
            <TextInput
              onChangeText={value => {
                dispatch({
                  type: 'Handle Input',
                  field: 'surname',
                  payload: value,
                });
              }}
              value={formState.surname}
              style={styles.input}
              editable={true}
              placeholder={'นามสกุล'}
              placeholderTextColor={colors.disable}
            />

            <Text style={styles.head}>วันเกิด</Text>
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
            <Text style={styles.head}>เบอร์โทรศัพท์</Text>
            <TextInput
              style={[styles.input, {backgroundColor: colors.disable}]}
              editable={false}
              value={tele}
              placeholderTextColor={colors.gray}
            />
          </ScrollView>
        </View>
        <View style={{backgroundColor: colors.white, zIndex: 0}}>
          <MainButton
            label="ถัดไป"
            disable={!formState.name || !formState.surname ? true : false}
            color={colors.greenLight}
            onPress={() => {
              Register.register1(
                formState.name,
                formState.surname,
                birthday,
                formState.tel,
              )
                .then(async res => {
                  console.log(res)
                  if (!image) {
                    setLoading(false);
                    navigation.navigate('SecondFormScreen', {
                      formState,
                    });
                  } else {
                    Register.uploadProfileImage(image)
                      .then(async res => {
                        setLoading(false);
                        navigation.navigate('SecondFormScreen', {
                          formState,
                        });
                      })
                      .catch(err => console.log(err));
                  }
                })
                .catch(err => console.log(err));
            }}
          />
        </View>
        <Modal transparent={true} visible={openModal}>
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
                borderRadius: normalize(3),
              }}>
              <MainButton
                fontFamily={font.SarabunLight}
                label="ถ่ายภาพ"
                fontColor={colors.fontBlack}
                color={colors.white}
                onPress={onCamera}
                width={100}
              />
              <MainButton
                fontFamily={font.SarabunLight}
                label="เลือกรูปถ่าย"
                fontColor={colors.fontBlack}
                color={colors.white}
                onPress={onAddImage}
                width={120}
              />
            </View>
          </View>
        </Modal>
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
                  {textAlign: 'center', bottom: '5%', color: colors.fontBlack},
                ]}>
                เลือกวันเกิด
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.greenLight,
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(16),
                }}>
                เลื่อนขึ้นลงเพื่อเลือกวันเกิดของคุณ
              </Text>
              <View>
                <DatePicker
                  modal
                  mode="date"
                  locale='th'
                  open={openCalendar}
                  date={date}
                  onConfirm={date => {
                    setOpenCalendar(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setOpenCalendar(false);
                  }}
                />
                {/* <DatePickerCustom
                  value={birthday}
                  onHandleChange={(day: Date) => {
                    const result = day.toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    });
                    console.log(result);
                    setBirthday(result);
                    //  const d =  day.toDateString().split(" ")
                    //   const newFarmer = `${d[0]} ${d[2]} ${d[1]} ${d[3]}`
                    //   console.log('res',newFarmer)
                    //   setBirthday(newFarmer)
                  }}
                /> */}
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
      </View>
    </SafeAreaView>
  );
};
export default FirstFormScreen;

const styles = StyleSheet.create({
  carlendar: {
    height: '50%',
    borderWidth: 1,
    borderColor: colors.disable,
    borderRadius: 10,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  datePart: {
    width: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '200',
    marginBottom: 5,
  },
  digit: {
    fontSize: 20,
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(16),
    color: colors.fontBlack,
    marginTop: normalize(24),
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.gray,
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
  input: {
    fontFamily: font.SarabunLight,
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  addImg: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
});
