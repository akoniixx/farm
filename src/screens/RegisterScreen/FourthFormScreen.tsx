import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../../assets';
import icons from '../../assets/icons/icons';
import image from '../../assets/images/image';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import { ProgressBar } from '../../components/ProgressBar';
import { Register } from '../../datasource/AuthDatasource';
import { normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
const width = Dimensions.get('window').width;
const FourthFormScreen: React.FC<any> = ({ route, navigation }) => {
  const telNo = route.params.tele;
  const Profile = route.params.profile ?? false;

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนเกษตรกร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <View style={{ marginBottom: normalize(10) }}>
            <ProgressBar index={4} />
          </View>
          <Text style={styles.h3}>ขั้นตอนที่ 4 จาก 4</Text>
          <Text style={styles.h1}>ยืนยันเอกสาร</Text>
          <Text style={styles.h2}>{`ยืนยันตัวตน ด้วยรูปถ่ายคู่ผู้สมัคร 
พร้อมบัตรประชาชน`}</Text>
          <View style={{ alignItems: 'center', top: '8%' }}>
            <Image
              source={image.examidcard}
              style={{ width: normalize(350), height: normalize(200) }}
            />
            <View style={styles.border}>
              <View style={styles.allText}>
                <Text style={styles.h4}>
                  <Image source={icons.dangercircle} />
                  <Text> </Text>
                  ลักษณะภาพถ่าย
                </Text>
                <Text style={styles.text}>กรุณาถ่ายหน้าตรง พร้อมถือ</Text>
                <Text style={styles.text}>
                  บัตรประชาชนของคุณโดยให้เห็นใบหน้า
                </Text>
                <Text style={styles.text}>และบัตรประชาชนอย่างชัดเจน</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: colors.white, zIndex: 0 }}>
          <MainButton
            label="ถัดไป"
            color={colors.greenLight}
            onPress={() => {
              navigation.navigate('AddIDCardScreen', {
                tele: telNo,
                profile: Profile,
              });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              Register.registerSkip4()
                .then(res => navigation.navigate('SuccessRegister'))
                .catch(err => console.log(err));
            }}>
            <View
              style={{ height: normalize(50), paddingVertical: normalize(10) }}>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(16),
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                ข้ามขั้นตอน
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default FourthFormScreen;
const styles = StyleSheet.create({
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(14),
    color: colors.fontBlack,
    top: '3%',
    textAlign: 'center',
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.gray,
  },
  h4: {
    fontFamily: font.SarabunBold,
    fontSize: normalize(14),
    color: colors.fontGrey,
  },
  text: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(14),
    color: colors.fontGrey,
    marginLeft: normalize(20),
  },
  varidate: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(12),
    color: 'red',
  },
  hSheet: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
  },
  allText: {
    top: '10%',
    marginLeft: normalize(20),
  },
  container: {
    flex: 1,
  },
  textaddplot: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%',
  },
  border: {
    top: '5%',
    borderColor: colors.yellow,
    backgroundColor: colors.yellowLight,
    borderWidth: 1,
    borderRadius: 15,
    height: normalize(110),
    width: normalize(350),
  },
  rectangleFixed: {
    left: '0%',
    position: 'absolute',
    top: '25%',
  },
  rectangle: {
    height: normalize(160),
    width: normalize(350),
    bottom: '15%',
  },
  input: {
    display: 'flex',
    paddingHorizontal: normalize(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: normalize(56),
    marginVertical: 12,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
  font1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.greenDark,
  },
});
