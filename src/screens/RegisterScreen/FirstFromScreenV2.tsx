import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '@rneui/themed';
import {colors, font, icons, image as img} from '../../assets';
import {ProgressBarV2} from '../../components/ProgressBarV2';
import Geolocation from 'react-native-geolocation-service';
import * as ImagePicker from 'react-native-image-picker';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {MainButton} from '../../components/Button/MainButton';
import {Register} from '../../datasource/AuthDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
import {Linking} from 'react-native';
import {responsiveHeigth, responsiveWidth} from '../../function/responsive';
import Text from '../../components/Text';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';

const FirstFormScreenV2: React.FC<any> = ({navigation, route}) => {
  const tele = route.params.tele;
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<any>({
    firstname: '',
    lastname: '',
  });
  const [image, setImage] = useState<any>(null);
  const [allowLoca, setAllowLoca] = useState<boolean>(false);
  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setImage(result);
    }
  }, []);
  return (
    <SafeAreaView style={stylesCentral.container}>
      {/* <View style={styles.inner}> */}
      {/* <View style={styles.container}> */}
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
          <CustomHeader
            title="ลงทะเบียนนักบินโดรน"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.inner}>
            <View style={styles.container}>
              <View style={{marginBottom: normalize(10)}}>
                <ProgressBarV2 index={1} />
              </View>
              <Text style={styles.label}>ขั้นตอนที่ 1 จาก 2</Text>
              <Text style={styles.h1}>กรอกข้อมูลทั่วไป</Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: normalize(40),
                }}>
                <TouchableOpacity
                  onPress={onAddImage}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      width: normalize(116),
                      height: normalize(116),
                      position: 'relative',
                    }}>
                    <ProgressiveImage
                      source={
                        !image ? icons.account : {uri: image.assets[0].uri}
                      }
                      style={{
                        width: normalize(116),
                        height: normalize(116),
                        borderRadius: normalize(58),
                      }}
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
              <View style={{marginTop: normalize(40)}}>
                <Text style={styles.h1}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
              </View>
              <TextInput
                onChangeText={value => {
                  setFormState({
                    ...formState,
                    firstname: value,
                  });
                }}
                scrollEnabled={false}
                value={formState.firstname}
                style={styles.input}
                editable={true}
                placeholder={'ชื่อ'}
                allowFontScaling={false}
                placeholderTextColor={colors.disable}
              />
              <TextInput
                scrollEnabled={false}
                allowFontScaling={false}
                onChangeText={value => {
                  setFormState({
                    ...formState,
                    lastname: value,
                  });
                }}
                value={formState.surname}
                style={styles.input}
                editable={true}
                placeholder={'นามสกุล'}
                placeholderTextColor={colors.disable}
              />
              <TextInput
                allowFontScaling={false}
                value={tele}
                style={[styles.input, {backgroundColor: colors.disable}]}
                editable={false}
                placeholder={'เบอร์โทรศัพท์'}
                placeholderTextColor={colors.disable}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: colors.white,
          zIndex: 0,
          margin: normalize(17),
        }}>
        <MainButton
          disable={!formState.firstname || !formState.lastname}
          color={colors.orange}
          label="ถัดไป"
          onPress={async () => {
            setLoading(true);
            try {
              if (Platform.OS === 'ios') {
                await Geolocation.requestAuthorization('always');
              } else if (Platform.OS === 'android') {
                await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
              }
              Geolocation.getCurrentPosition(position => {
                Register.registerStep1V2(
                  formState.firstname,
                  formState.lastname,
                  tele,
                )
                  .then(async res => {
                    if (!image) {
                      await AsyncStorage.setItem('droner_id', res.id);
                      setLoading(false);
                      setTimeout(() => {
                        navigation.navigate('SecondFormScreenV2', {
                          tele: route.params.telNumber,
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                        });
                      }, 500);
                    } else {
                      Register.uploadProfileImage(image)
                        .then(async () => {
                          await AsyncStorage.setItem('droner_id', res.id);
                          navigation.navigate('SecondFormScreenV2', {
                            tele: route.params.telNumber,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                          });
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }
                  })
                  .catch(err => console.log(err));
              });
            } catch (err) {
              setLoading(false);
            }
          }}
        />
      </View>
      <Modal transparent={true} visible={loading}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: colors.white,
              width: normalize(50),
              height: normalize(50),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: normalize(8),
            }}>
            <Lottie
              source={img.loading}
              autoPlay
              loop
              style={{
                width: normalize(50),
                height: normalize(50),
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={allowLoca}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: colors.white,
              width: responsiveWidth(344),
              paddingHorizontal: normalize(20),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: normalize(8),
              paddingVertical: normalize(20),
            }}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
              }}>
              กรุณาเปิดการตั้งค่า
            </Text>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
              }}>
              การเข้าถึงตำแหน่งหรือโลเคชั่น
            </Text>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
              }}>
              ในโทรศัพท์
            </Text>
            <Text
              style={{
                fontFamily: font.light,
                fontSize: normalize(14),
                paddingTop: normalize(10),
              }}>
              เพื่อเปิดการค้นหาเกษตรกรที่อยู่ใกล้
            </Text>
            <Text
              style={{
                fontFamily: font.light,
                fontSize: normalize(14),
              }}>
              พื้นที่ให้บริการของคุณ
            </Text>
            <MainButton
              style={{
                width: responsiveWidth(312),
                height: responsiveHeigth(53),
                marginTop: normalize(20),
              }}
              label="ตกลง"
              color={colors.orange}
              onPress={() => {
                Linking.openSettings();
                setAllowLoca(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.medium,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
    marginTop: normalize(24),
  },
  label: {
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
});

export default FirstFormScreenV2;
