import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Button,
  Dimensions,
  Image,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize, width } from '../../functions/Normalize';
import { Authentication, Register } from '../../datasource/AuthDatasource';
import { ProgressBar } from '../../components/ProgressBar';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Avatar } from '@rneui/base';
import { registerReducer } from '../../hook/registerfield';
import * as ImagePicker from 'react-native-image-picker';
import icons from '../../assets/icons/icons';
import { momentExtend } from '../../utils/moment-buddha-year';
import { Modal } from 'react-native';
import DatePickerCustom from '../../components/Calendar/Calendar';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import moment from 'moment';

const FirstFormScreen: React.FC<any> = ({ navigation, route }) => {
  const initialFormRegisterState = {
    name: '',
    surname: '',
    birthDate: '',
    tel: route.params.tele,
  };
  const tele = route.params.tele;
  const windowWidth = Dimensions.get('window').width;
  const [image, setImage] = useState<any>(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string | null>(null);

  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
      setOpenModal(false);
    }
  }, [image]);

  // const onCamera = useCallback(async () => {
  //   const result = await ImagePicker.launchCamera({
  //     mediaType: 'photo',
  //   });
  //   if (!result.didCancel) {
  //     setImage(result);
  //     setOpenModal(false);
  //   }
  // }, [image]);

  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="ลงทะเบียนเกษตรกร"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />

          <View style={styles.inner}>
            <View style={styles.containerTopCard}>
              <View style={{ marginBottom: normalize(10) }}>
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
                        source={
                          !image ? icons.avatar : { uri: image.assets[0].uri }
                        }
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
                  placeholderTextColor={colors.gray}
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
                  placeholderTextColor={colors.gray}
                />

                <Text style={styles.head}>วันเกิด*</Text>
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
                      value={
                        date
                          ? momentExtend.toBuddhistYear(date, 'DD MMMM YYYY')
                          : ''
                      }
                      editable={false}
                      placeholder={'ระบุวัน เดือน ปี'}
                      placeholderTextColor={colors.gray}
                      style={{
                        width: windowWidth * 0.78,
                        color: colors.fontBlack,
                        fontSize: normalize(16),
                        fontFamily: font.SarabunLight,
                        justifyContent: 'center',
                        alignItems: 'center',
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
                  style={[styles.input, { backgroundColor: colors.disable }]}
                  editable={false}
                  value={tele}
                  placeholderTextColor={colors.disable}
                />
              </ScrollView>
              <View style={{ backgroundColor: colors.white, zIndex: 0 }}>
                <MainButton
                  label="ถัดไป"
                  disable={
                    !formState.name || !formState.surname || !date
                      ? true
                      : false
                  }
                  color={colors.greenLight}
                  onPress={() => {
                    setLoading(true);
                    Register.register1(
                      formState.name,
                      formState.surname,
                      date,
                      formState.tel,
                    )
                      .then(async res => {
                        setLoading(false);
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
                    <TouchableOpacity
                      onPress={() => {
                        setOpenModal(false);
                      }}>
                      <View style={{ alignSelf: 'flex-end' }}>
                        <Image source={icons.close} />
                      </View>
                    </TouchableOpacity>

                    {/* <MainButton
                      fontFamily={font.SarabunLight}
                      label="ถ่ายภาพ"
                      fontColor={colors.fontBlack}
                      color={colors.white}
                      onPress={onCamera}
                      width={100}
                    /> */}
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
                        {
                          textAlign: 'center',
                          bottom: '5%',
                          color: colors.fontBlack,
                        },
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
                      <DatePickerCustom
                        startYear={
                          moment().subtract(76, 'years').get('year') + 543
                        }
                        value={
                          date
                            ? date
                            : moment().set({ date: 1 }).subtract(76, 'years')
                        }
                        onHandleChange={(d: string) => {
                          setDate(d);
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        top: 10,
                      }}>
                      <View style={{ right: 10 }}>
                        <MainButton
                          label="ยกเลิก"
                          fontColor={colors.fontBlack}
                          borderColor={colors.fontGrey}
                          color={colors.white}
                          width={150}
                          onPress={() => setOpenCalendar(false)}
                        />
                      </View>
                      <View style={{ left: 10 }}>
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
                </View>
              </Modal>
            </View>
          </View>
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  container: {
    flex: 1,
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
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  headText: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    marginBottom: normalize(24),
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
    marginTop: normalize(24),
  },
  containerTopCard: {
    flex: 1,
  },
});
