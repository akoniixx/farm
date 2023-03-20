import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../../styles/StylesCentral';
import { colors, font, icons, image as img } from '../../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal/dist/modal';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { callcenterNumber } from '../../../definitions/callCenterNumber';
import fonts from '../../../assets/fonts';
import CustomHeader from '../../../components/CustomHeader';
import { TaskDatasource } from '../../../datasource/TaskDatasource';
import { Authentication } from '../../../datasource/AuthDatasource';
import { MainButton } from '../../../components/Button/MainButton';
import * as RootNavigation from '../../../navigations/RootNavigation';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../contexts/AuthContext';
import { normalize, width } from '../../../functions/Normalize';
import { StackNativeScreenProps } from '../../../navigations/MainNavigator';
import { ProfileDatasource } from '../../../datasource/ProfileDatasource';
import { MyJobDatasource } from '../../../datasource/MyJobDatasource';
import { SearchMyJobsEntites } from '../../../entites/SearchMyJobsEntites';

type DeleteProfileScreenProps = StackNativeScreenProps<'DeleteProfileScreen'>;

const DeleteProfile: React.FC<DeleteProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const windowWidth = Dimensions.get('window').width;
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tel, setTel] = useState<any>();
  const [selectedField, setSelectedField] = useState({
    name: 'ใกล้ถึงวันงาน',
    value: 'coming_task',
    direction: '',
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const farmer_id = (await AsyncStorage.getItem('farmer_id')) ?? '';
      const params: SearchMyJobsEntites = {
        farmerId: farmer_id,
        stepTab: '0',
        sortField: selectedField.value,
        sortDirection: selectedField.direction,
        filterStatus: 'WAIT_RECEIVE' || 'IN_PROGRESS',
      };
      MyJobDatasource.getMyJobsList(params)
        .then(res => {
          if (res !== undefined) {
            setTask(res);
            setLoading(false);
          }
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    };
    getData();
  }, []);
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!)
      .then(res => {
        setTel(res);
      })
      .catch(err => console.log(err));
  };

  const requestOtp = async () => {
    setToggleModal(false);
    try {
      const data = await Authentication.generateOtpDelete(tel.telephoneNo);
      navigation.navigate('VerifyOTP', {
        telNumber: tel.telephoneNo,
        ...data.result,
      });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลบบัญชี"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <View>
            <Text
              style={{
                fontFamily: fonts.SarabunBold,
                fontWeight: '600',
                fontSize: normalize(18),
                color: 'black',
                textAlign: 'center',
              }}>
              เงื่อนไขการลบบัญชี
            </Text>
          </View>
          <View style={{ marginTop: normalize(10) }}>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: 'black',
                textAlign: 'center',
              }}>
              หากคุณมีการจ้างงานบินฉีดพ่นที่อยู่ระหว่าง
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: 'black',
                textAlign: 'center',
              }}>
              กำลังดำเนินงานหรือรอเริ่มงาน
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: 'black',
                textAlign: 'center',
              }}>
              คุณจะไม่สามารถลบบัญชีของคุณได้
            </Text>
          </View>
          <View style={{ marginTop: normalize(30) }}>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: '#1F8449',
                textAlign: 'center',
              }}>
              หากคุณมีปัญหาในการใช้งาน
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: '#1F8449',
                textAlign: 'center',
              }}>
              คุณสามารถติดต่อเจ้าหน้าที่
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: '#1F8449',
                textAlign: 'center',
              }}>
              โทร. 02-233-9000
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          marginBottom: 16,
          paddingHorizontal: 20,
        }}>
        <MainButton
          label="ลบบัญชี"
          disable={task?.length > 0}
          color={colors.error}
          fontColor={'white'}
          onPress={() => {
            setToggleModal(!toggleModal);
          }}
        />
      </View>
      <Modal isVisible={toggleModal}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: normalize(15),
            borderRadius: 12,
            height: normalize(375),
          }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={icons.delete}
              style={{ width: 24, height: 24, bottom: 10 }}
            />
            <Text
              style={{
                fontFamily: font.AnuphanBold,
                fontSize: normalize(22),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              ยืนยันการลบบัญชี
            </Text>
            <Text
              style={{
                fontFamily: font.SarabunLight,
                fontSize: normalize(18),
                color: colors.fontBlack,
                textAlign: 'center',
              }}>
              คำขอจะถูกส่งไปยังเจ้าหน้าที่
            </Text>
            <Text
              style={{
                fontFamily: font.SarabunLight,
                fontSize: normalize(18),
                color: colors.inkLight,
                textAlign: 'center',
              }}>
              และบัญชีของคุณจะถูกลบอย่างถาวร
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(18),
                  color: colors.inkLight,
                  textAlign: 'center',
                }}>
                มีคำถามเพิ่มเติมสามารถติดต่อเจ้าหน้าที่
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(18),
                  color: colors.inkLight,
                  textAlign: 'center',
                }}>
                โทร. 02-233-9000
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 16,
            }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(10),
                backgroundColor: colors.error,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 8,
                height: normalize(52),
              }}
              onPress={requestOtp}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(20),
                  color: 'white',
                }}>
                ยืนยันการลบบัญชี
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(10),
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 8,
                borderWidth: 0.5,
                borderColor: colors.inkLight,
                height: normalize(52),
              }}
              onPress={() => setToggleModal(!toggleModal)}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(20),
                  color: 'black',
                }}>
                ยกเลิก
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};
export default DeleteProfile;

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
    marginTop: normalize(24),
  },
  label: {
    fontFamily: font.SarabunLight,
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
  deleteLabel: {
    padding: 10,
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    textAlign: 'center',
    color: colors.fontBlack,
  },
  deleteText: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    textAlign: 'center',
    color: colors.fontBlack,
  },
});
