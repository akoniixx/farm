import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize, width } from '../../functions/Normalize';
import { ProgressBar } from '../../components/ProgressBar';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { registerReducer } from '../../hook/registerfield';
import ImagePicker from 'react-native-image-crop-picker';

import icons from '../../assets/icons/icons';

import Spinner from 'react-native-loading-spinner-overlay/lib';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import InputTextLabel from '../../components/InputText/InputTextLabel';
import ModalUploadImage from '../../components/Modal/ModalUploadImage';
import { ResizeImage } from '../../functions/Resizing';
import { Register } from '../../datasource/AuthDatasource';

const FirstFormScreen: React.FC<any> = ({ navigation, route }) => {
  const initialFormRegisterState = {
    name: '',
    surname: '',
    tel: route.params.tele,
    nickname: '',
  };
  const tele = route.params.tele;
  const [image, setImage] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.openPicker({
      mediaType: 'photo',
      width: 200,
      height: 200,
      maxFiles: 1,
      multiple: false,
      cropping: true,
    });
    if (result) {
      setImage({
        ...result,
        assets: [
          {
            fileSize: result.size,
            type: result.mime,
            fileName: result?.filename,
            uri: result.path,
          },
        ],
      });
      setOpenModal(false);
    }
  }, []);

  const onPressCamera = useCallback(async () => {
    const result = await ImagePicker.openCamera({
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      cropping: true,
    });
    if (result) {
      setImage({
        ...result,
        assets: [
          {
            fileSize: result.size,
            type: result.mime,
            fileName: result?.filename,
            uri: result.path,
          },
        ],
      });
      setOpenModal(false);
    }
  }, []);
  const onFinishedTakePhotoAndroid = useCallback(async (value: any) => {
    if (value) {
      setImage(value);
      setOpenModal(false);
    }
  }, []);

  const onSubmit = async () => {
    mixpanel.track('Tab next first form register');
    setLoading(true);
    await Register.register1({
      firstname: formState.name,
      lastname: formState.surname,
      telephoneNo: tele,
      nickname: formState.nickname,
    });
    if (!image) {
      setLoading(false);
      navigation.navigate('SecondFormScreen', {
        formState,
      });
    } else {
      await Register.uploadProfileImage(image)
        .then(async () => {
          setLoading(false);
          setTimeout(() => {
            navigation.navigate('SecondFormScreen', {
              formState,
            });
          }, 400);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

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
            onPressBack={() => {
              mixpanel.track('Tab back first form register');
              navigation.goBack();
            }}
          />

          <View style={styles.inner}>
            <View style={styles.containerTopCard}>
              <View style={{ marginBottom: normalize(10) }}>
                <ProgressBar index={1} />
              </View>
              <Text style={styles.h3}>ขั้นตอนที่ 1 จาก 2</Text>
              <Text style={styles.h1}>ระบุข้อมูลส่วนตัว</Text>
              <ScrollView>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: normalize(40),
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      mixpanel.track('Tab add profile image in register');
                      setOpenModal(true);
                    }}>
                    <View
                      style={{
                        width: normalize(116),
                        height: normalize(116),
                        position: 'relative',
                      }}>
                      <ProgressiveImage
                        style={{
                          width: normalize(116),
                          height: normalize(116),
                          borderRadius: normalize(58),
                        }}
                        source={
                          !image ? icons.avatar : { uri: image.assets[0].uri }
                        }
                      />
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: normalize(32),
                          height: normalize(32),
                          borderRadius: normalize(16),
                          backgroundColor: colors.white,
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
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

                <InputTextLabel
                  label="ชื่อ"
                  required
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
                  placeholder={' ระบุชื่อ'}
                />
                <InputTextLabel
                  label="นามสกุล"
                  required
                  onChangeText={value => {
                    dispatch({
                      type: 'Handle Input',
                      field: 'surname',
                      payload: value,
                    });
                  }}
                  allowFontScaling={false}
                  value={formState.surname}
                  style={styles.input}
                  editable={true}
                  placeholder={' ระบุนามสกุล'}
                  placeholderTextColor={colors.gray}
                />
                <InputTextLabel
                  label="ชื่อเล่น"
                  optional
                  onChangeText={value => {
                    dispatch({
                      type: 'Handle Input',
                      field: 'nickname',
                      payload: value,
                    });
                  }}
                  allowFontScaling={false}
                  value={formState.nickname}
                  style={styles.input}
                  editable={true}
                  placeholder={' ระบุนามสกุล'}
                  placeholderTextColor={colors.gray}
                />

                <Text style={styles.head}>เบอร์โทรศัพท์</Text>
                <TextInput
                  allowFontScaling={false}
                  style={[styles.input, { backgroundColor: '#F2F3F4' }]}
                  editable={false}
                  value={` ${tele}`}
                  placeholderTextColor={colors.disable}
                />
              </ScrollView>
              <View style={{ backgroundColor: colors.white, zIndex: 0 }}>
                <MainButton
                  label="ถัดไป"
                  color={colors.greenLight}
                  onPress={onSubmit}
                  disable={formState.name === '' || formState.surname === ''}
                />
              </View>
            </View>
          </View>
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <ModalUploadImage
        visible={openModal}
        onPressLibrary={onAddImage}
        onPressCamera={onPressCamera}
        onFinishedTakePhotoAndroid={onFinishedTakePhotoAndroid}
        onCloseModalSelect={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      />
      {/* <Modal transparent={true} visible={openCalendar}>
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
      </Modal> */}
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
    fontSize: normalize(20),
    color: colors.fontBlack,
    top: 5,
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
    fontFamily: font.AnuphanSemiBold,
    fontSize: normalize(16),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
  input: {
    fontFamily: font.SarabunLight,
    height: normalize(56),
    marginVertical: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(20),
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
