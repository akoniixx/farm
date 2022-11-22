import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize} from '@rneui/themed';
import colors from '../../assets/colors/colors';
import {font, icons, image as img} from '../../assets';
import {MainButton} from '../../components/Button/MainButton';
import * as ImagePicker from 'react-native-image-picker';
import {ProgressBar} from '../../components/ProgressBar';
import Lottie from 'lottie-react-native';

const width = Dimensions.get('window').width;

const AddIDcardScreen: React.FC<any> = ({route, navigation}) => {
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
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ยืนยันเอกสาร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View>
          <Text style={styles.label}>{`ยืนยันตัวตน ด้วยรูปถ่ายคู่ผู้สมัคร 
พร้อมบัตรประชาชน`}</Text>
          <View style={{paddingTop: 20}}>
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
                    height: normalize(162),
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
                      height: normalize(162),
                      borderRadius: 20,
                      zIndex: 0,
                    }}>
                    <Image
                      source={{uri: image.assets[0].uri}}
                      style={{
                        width: width * 0.9,
                        height: normalize(162),
                        borderRadius: 20,
                      }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
            <Text
              style={{fontFamily: font.AnuphanMedium, fontSize: normalize(20)}}>
              บัตรประชาชน
            </Text>
            <TextInput
              style={styles.input}
              placeholder="ระบุเลขบัตรประชาชน"
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
        </View>
        <MainButton
          label="ยืนยันการสมัคร"
          color={
            idcard.length === 13 && image != null
              ? colors.greenLight
              : colors.disable
          }
          disable={idcard.length === 13 && image != null ? false : true}
          onPress={() => {
            if (idcard.length === 13 && image != null) {
              setLoading(true);
              setOpenModal(true);
            }
          }}
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
              <Text style={[styles.h2, {textAlign: 'center', bottom: '3%'}]}>
                {`คุณต้องการยืนยันการสมัคร
ใช่ไหม?`}
              </Text>
              <Text
                style={[
                  styles.label,
                  {textAlign: 'center', marginVertical: 5},
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
                  navigation.navigate('SuccessRegister');
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(17),
  },
  page4: {
    width: width * 0.9,
    height: normalize(79),
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: normalize(16),
    backgroundColor: '#FFFBF7',
    paddingHorizontal: normalize(30),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: colors.orange,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: normalize(15),
    backgroundColor: '#FFFBF7',
  },
  h1: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontGrey,
    textAlign: 'center',
  },
  container: {
    flex: 1,
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
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
  },
  camera: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});
export default AddIDcardScreen;
