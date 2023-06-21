import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Image} from 'react-native';
import {normalize, width} from '../../function/Normalize';
import {colors, font} from '../../assets';
import icons from '../../assets/icons/icons';
import CustomHeader from '../../components/CustomHeader';
import fonts from '../../assets/fonts';
import image from '../../assets/images/image';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {Register} from '../../datasource/AuthDatasource';

const MyProfileScreen: React.FC<any> = ({navigation, route}) => {
  const [drone, setDrone] = useState();
  const [plants, setPlants] = useState();
  const [idCard, setIdCard] = useState();
  const [checkNum, setCheckNum] = useState<number>(0);
  const [checked, setChecked] = useState<number>(50);
  const [reload, setReload] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const droner_id = await AsyncStorage.getItem('droner_id');
      ProfileDatasource.getProfile(droner_id!).then(res => {
        setLoading(false);
        setDrone(res.dronerDrone[0]);
        setPlants(res.expPlant[0]);
        setIdCard(res.idNo);
        setCheckNum(res.percentSuccess);
        if (res.status === 'PENDING') {
          setShowModal(true);
        }
      });
    };
    getProfile();
  }, [isFocused]);

  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <CustomHeader
        showBackBtn
        onPressBack={() => navigation.goBack()}
        title={'โปรไฟล์ของคุณ'}
      />
      <View style={[styles.body]}>
        <View style={[styles.cardProgress]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <AnimatedCircularProgress
              size={60}
              width={5}
              fill={checkNum}
              tintColor="#FB8705"
              backgroundColor="#FFEFDD"
              rotation={0}>
              {fill => (
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: normalize(14),
                    color: colors.fontBlack,
                  }}>
                  {checkNum + '%'}
                </Text>
              )}
            </AnimatedCircularProgress>

            <Text style={[styles.textCard, {left: 5}]}>
              {`ใช้เวลาเพียง 2 นาที กรอกข้อมูลโปรไฟล์ 
ของคุณให้สมบูรณ์เพื่อเริ่มรับงานบิน 
โดรนในระบบ`}
            </Text>
          </View>
          <View style={[styles.pending]}>
            <Text style={[styles.textPending]}>รอยืนยันตัวตน</Text>
          </View>
        </View>
        <View style={{paddingVertical: normalize(12)}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddDroneScreen')}>
            <View style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={drone ? icons.checkOrange : image.num1}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.text}>เพิ่มโดรน</Text>
              </View>
              <Image
                source={icons.arrowRight}
                style={{width: 30, height: 30}}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddPlantsScreen')}>
            <View style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={plants ? icons.checkOrange : image.num2}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.text}>เพิ่มพืชที่เคยฉีดพ่น</Text>
              </View>
              <Image
                source={icons.arrowRight}
                style={{width: 30, height: 30}}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('IDCardScreen')}>
            <View style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={idCard ? icons.checkOrange : image.num3}
                  style={{width: 30, height: 30}}
                />
                <Text style={styles.text}>เพิ่มรูปคู่บัตรประชาชน</Text>
              </View>
              <Image
                source={icons.arrowRight}
                style={{width: 30, height: 30}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              marginTop: 10,
              width: '100%',
              paddingVertical: normalize(16),
              borderRadius: 12,
              paddingHorizontal: 16,
            }}>
            <View style={{paddingVertical: 20}}>
              <Image
                source={image.regisSuccess}
                style={{
                  width: normalize(180),
                  height: normalize(180),
                  alignSelf: 'center',
                }}
              />
            </View>

            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 22,
                textAlign: 'center',
                paddingBottom: 2,
              }}>
              ยินดีด้วย!
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 22,
                textAlign: 'center',
                paddingBottom: 20,
              }}>
              คุณทำโปรไฟล์เสร็จสมบูรณ์แล้ว
            </Text>
            <Text
              style={{
                fontFamily: fonts.light,
                fontSize: 18,
                textAlign: 'center',
                paddingBottom: 2,
              }}>
              กรุณารอเจ้าหน้าที่ตรวจสอบเอกสารยืนยัน
            </Text>
            <Text
              style={{
                fontFamily: fonts.light,
                fontSize: 18,
                textAlign: 'center',
                paddingBottom: 20,
              }}>
              บัญชีนักบินโดรนของคุณ เพื่อรับงานบินโดรน
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileScreen');
                setShowModal(false);
              }}
              style={{
                height: 60,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: colors.orange,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                borderRadius: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colors.white,
                  fontSize: 20,
                }}>
                ตกลง
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
};
export default MyProfileScreen;
const styles = StyleSheet.create({
  body: {
    flex: 9,
    paddingTop: normalize(10),
    paddingHorizontal: normalize(17),
    color: colors.fontBlack,
  },
  cardProgress: {
    padding: normalize(8),
    borderWidth: 0.5,
    borderRadius: normalize(15),
    borderColor: colors.disable,
  },
  textCard: {
    fontSize: normalize(16),
    fontFamily: fonts.bold,
  },
  text: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    left: 20,
    color: colors.fontBlack,
  },
  number: {
    borderWidth: 1,
    borderRadius: 20,
    width: normalize(20),
    height: 'auto',
    padding: normalize(6),
  },
  listTile: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalize(0.5),
    borderBottomColor: colors.disable,
  },
  pending: {
    backgroundColor: colors.orangeSoft,
    borderRadius: 16,
    padding: normalize(4),
    width: normalize(100),
    left: '20%',
  },
  textPending: {
    fontSize: normalize(14),
    fontFamily: fonts.bold,
    color: colors.darkOrange2,
    alignSelf: 'center',
  },
});
