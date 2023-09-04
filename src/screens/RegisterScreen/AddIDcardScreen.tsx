import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import React, { useCallback, useState } from 'react';
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
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { mixpanel } from '../../../mixpanel';
import Spinner from 'react-native-loading-spinner-overlay';
import Text from '../../components/Text/Text';

const AddIDcardScreen: React.FC<any> = ({ navigation, route }) => {
  const telNo = route.params.tele;
  const Profile = route.params.profile;

  const width = Dimensions.get('window').width;
  const [image, setImage] = useState<any>(null);
  const [idcard, setIdCard] = useState<any>('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalCard, setOpenModalCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
      setOpenModalCard(false);
    }
  }, [image]);

  const onCamera = useCallback(async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
      setOpenModalCard(false);
    }
  }, [image]);

  const onSubmit = async () => {
    if (idcard.length === 13 && image != null) {
      if (Profile) {
        mixpanel.track('Tab confirm from add id card register');
        setLoading(true);
        ProfileDatasource.addIdCard(idcard)
          .then(res => {
            ProfileDatasource.uploadFarmerIDCard(image)
              .then(res => {
                setLoading(false);
                navigation.navigate('MainScreen');
              })
              .catch(err => console.log(err));
          })
          .finally(() => {
            setLoading(false);
          })
          .catch(err => console.log(err));
      } else {
        setOpenModal(true);
      }
    }
  };
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
              mixpanel.track('Tab back from add id card register');
              navigation.goBack();
            }}
          />

          <View style={styles.inner}>
            <View style={styles.containerTopCard}>
              <ScrollView>
                <Text style={styles.label}>{`ยืนยันตัวตน ด้วยรูปถ่ายคู่ผู้สมัคร 
พร้อมบัตรประชาชน`}</Text>
                <View style={{ paddingTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => setOpenModalCard(true)}
                    style={{
                      marginVertical: 20,
                    }}>
                    {image == null ? (
                      <View style={styles.addImage}>
                        <View style={styles.camera}>
                          <Image
                            source={icons.camera}
                            style={{
                              width: 19,
                              height: 16,
                            }}
                          />
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: width * 0.9,
                          height: normalize(220),
                          borderRadius: 20,
                          position: 'relative',
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: colors.white,
                            borderRadius: 12,
                            padding: 10,
                            height: 38,
                            zIndex: 3,
                          }}>
                          <Text style={styles.h3}>เปลี่ยนรูป</Text>
                        </View>
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: width * 0.9,
                            height: normalize(220),
                            borderRadius: 20,
                            zIndex: 0,
                          }}>
                          <Image
                            source={{ uri: image.assets[0].uri }}
                            style={{
                              width: width * 0.9,
                              height: normalize(220),
                              borderRadius: 20,
                            }}
                          />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      fontSize: normalize(20),
                    }}>
                    บัตรประชาชน
                  </Text>
                  <TextInput
                    maxLength={13}
                    style={styles.input}
                    placeholder="ระบุเลขบัตรประชาชน"
                    placeholderTextColor={colors.disable}
                    onChangeText={value => {
                      setIdCard(value);
                    }}
                  />
                  <Text
                    style={{
                      color: colors.fontBlack,
                      fontFamily: font.SarabunLight,
                      fontSize: normalize(16),
                    }}>
                    ใส่เลข 13 หลักบนบัตรโดยไม่ต้องเว้นวรรค
                  </Text>
                </View>
              </ScrollView>
            </View>
            <MainButton
              label="ยืนยันการสมัคร"
              color={
                idcard.length === 13 && image != null
                  ? colors.greenLight
                  : colors.disable
              }
              disable={idcard.length === 13 && image != null ? false : true}
              onPress={onSubmit}
            />
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
                    borderRadius: normalize(8),
                  }}>
                  <Text
                    style={[styles.h2, { textAlign: 'center', bottom: '3%' }]}>
                    {`คุณต้องการยืนยันการสมัคร
  ใช่ไหม?`}
                  </Text>
                  <Text
                    style={[
                      styles.label,
                      { textAlign: 'center', marginVertical: 5 },
                    ]}>
                    กรุณาตรวจสอบรายละเอียดการสมัคร สมาชิก ของคุณให้ครบถ้วน
                    หากมีการข้าม บางขั้นตอนในการสมัครอาจทำให้ใช้งาน
                    ระบบได้เพียงบางส่วน
                  </Text>
                  <MainButton
                    label="ยืนยัน"
                    color={colors.greenLight}
                    onPress={() => {
                      setOpenModal(false);
                      setLoading(true);
                      Register.register4(telNo, idcard)
                        .then(res => {
                          Register.uploadFarmerIDCard(image)
                            .then(res => {
                              setLoading(false);
                              navigation.navigate('SuccessRegister');
                            })
                            .catch(err => console.log(err))
                            .finally(() => {
                              setLoading(false);
                            });
                        })
                        .catch(err => console.log(err));
                    }}
                  />
                  <MainButton
                    label="ยกเลิก"
                    fontColor={colors.fontBlack}
                    color={colors.white}
                    onPress={() => {
                      setOpenModal(false);
                    }}
                  />
                </View>
              </View>
            </Modal>
            <Modal transparent={true} visible={openModalCard}>
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
                      setOpenModalCard(false);
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
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: colors.white }}
      />
    </KeyboardAvoidingView>
  );
};
export default AddIDcardScreen;

const styles = StyleSheet.create({
  camera: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  addImage: {
    width: width * 0.9,
    height: normalize(162),
    borderColor: '#EBEEF0',
    borderWidth: 0.5,
    backgroundColor: '#FAFAFB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  label: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontGrey,
    textAlign: 'center',
  },
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
  containerTopCard: {
    flex: 1,
  },
});
