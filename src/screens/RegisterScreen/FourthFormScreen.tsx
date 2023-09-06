import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { mixpanel } from '../../../mixpanel';
import { colors, font } from '../../assets';
import icons from '../../assets/icons/icons';
import image from '../../assets/images/image';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import { ProgressBar } from '../../components/ProgressBar';
import { Register } from '../../datasource/AuthDatasource';
import { normalize } from '../../functions/Normalize';
import Text from '../../components/Text/Text';
const FourthFormScreen: React.FC<any> = ({ route, navigation }) => {
  const telNo = route.params.tele;
  const Profile = route.params.profile ?? false;

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
      <CustomHeader
        title="ลงทะเบียนเกษตรกร"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('Tab back fourth form register');
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <View style={styles.inner}>
                <View style={styles.container}>
                  <View style={{ marginBottom: normalize(10) }}>
                    <ProgressBar index={4} />
                  </View>
                  <Text style={styles.h3}>ขั้นตอนที่ 4 จาก 4</Text>
                  <Text style={styles.h1}>ยืนยันเอกสาร</Text>
                </View>
              </View>
              <Text style={styles.h2}>{`ยืนยันตัวตน ด้วยรูปถ่ายคู่ผู้สมัคร 
พร้อมบัตรประชาชน`}</Text>
              <View style={{ alignItems: 'center', top: '8%' }}>
                <Image
                  source={image.examidcard}
                  style={{ width: normalize(350), height: normalize(200) }}
                />
                <View style={[styles.border]}>
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
            <View style={{ paddingHorizontal: 10, marginVertical: 8 }}>
              <MainButton
                label="ถัดไป"
                color={colors.greenLight}
                onPress={() => {
                  mixpanel.track('Tab next to add id card form register');
                  navigation.navigate('AddIDCardScreen', {
                    tele: telNo,
                    profile: Profile,
                  });
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  mixpanel.track('Tab skip to add id card form register');
                  Register.registerSkip4()
                    .then(async res => navigation.navigate('SuccessRegister'))
                    .catch(err => console.log(err));
                }}>
                <View style={{ paddingVertical: 30 }}>
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      fontSize: normalize(20),
                      alignSelf: 'center',
                      textAlign: 'center',
                      color: colors.fontGrey,
                    }}>
                    ข้ามขั้นตอน
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default FourthFormScreen;
const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    // flex: 1,
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
    // flex: 1,
  },
  textaddplot: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%',
  },
  border: {
    ...Platform.select({
      ios: {
        top: '5%',
        borderColor: colors.yellow,
        backgroundColor: colors.yellowLight,
        borderWidth: 1,
        borderRadius: 15,
        height: normalize(110),
        width: normalize(350),
      },
      android: {
        top: '5%',
        borderColor: colors.yellow,
        backgroundColor: colors.yellowLight,
        borderWidth: 1,
        borderRadius: 15,
        height: normalize(130),
        width: normalize(350),
      },
    }),
  },
  font1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.greenDark,
  },
});
