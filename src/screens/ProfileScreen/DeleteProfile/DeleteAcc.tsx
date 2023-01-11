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
  Modal,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {stylesCentral} from '../../../styles/StylesCentral';
import CustomHeader from '../../../components/CustomHeader';
import {normalize} from '../../../functions/Normalize';
import {colors, font} from '../../../assets';
import {MainButton} from '../../../components/Button/MainButton';
import {InputPhone} from '../../../components/InputPhone';

const DeleteAcc: React.FC<any> = ({navigation}) => {
  const [openModal, setOpenModal] = useState(false);
  const width = Dimensions.get('window').width;

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="ลบบัญชี"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inner}>
          <View style={[styles.TextAll]}>
            <Text style={[styles.head, {fontWeight: 'bold', bottom: 10}]}>
              เงื่อนไขการลบบัญชี
            </Text>
            <Text style={[styles.head]}>
              {`หากคุณมีการจ้างงานบินฉีดพ่นที่อยู่ระหว่าง 
 กำลังดำเนินงาน หรือรอเริ่มงาน 
 คุณจะไม่สามารถลบบัญชีของคุณได้`}
            </Text>
            <Text style={styles.text}>
              {`หากคุณมีปัญหาในการใช้งาน 
 คุณสามารถติดต่อเจ้าหน้าที่ 
 โทร. 02-113-6159`}
            </Text>
          </View>
          <View>
            <MainButton
              label="ลบบัญชี"
              color={colors.error}
              onPress={() => setOpenModal(true)}
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
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: normalize(8),
                  width: width * 0.9,
                }}>
                <Text style={[styles.deleteText]}>{`ยืนยันการลบบัญชี`}</Text>
                <Text style={[styles.deleteLabel]}>
                  {`คำขอจะถูกส่งไปยังเจ้าหน้าที่ 
และบัญชีของคุณจะถูกลบอย่างถาวร`}
                </Text>
                <Text style={[styles.deleteLabel]}>
                  {`มีคำถามเพิ่มเติมสามารถติดต่อเจ้าหน้าที่
โทร. 02-113-6159`}{' '}
                </Text>
                <MainButton
                  style={{height: 52}}
                  label="ยืนยันการลบบัญชี"
                  color={colors.error}
                  onPress={() => {
                    setOpenModal(false);
                    navigation.navigate("DeleteSuccess");
                  }}
                />
                <MainButton
                  style={{height: 52}}
                  label="ยกเลิก"
                  fontColor={colors.fontBlack}
                  color={colors.white}
                  borderColor={colors.gray}
                  onPress={() => {
                    setOpenModal(false);
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default DeleteAcc;

const styles = StyleSheet.create({
  deleteText: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    textAlign: 'center',
    color: colors.fontBlack,
  },
  deleteLabel: {
    padding: 10,
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    textAlign: 'center',
    color: colors.fontBlack,
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    height: normalize(54),
    width: normalize(343),
    alignSelf: 'center',
  },
  TextAll: {
    alignItems: 'center',
  },
  head: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
    fontWeight: '300',
    textAlign: 'center',
    top: '-50%',
  },
  text: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.primary,
    fontWeight: '200',
    textAlign: 'center',
    paddingVertical: 20,
    top: '-50%',
  },
});
