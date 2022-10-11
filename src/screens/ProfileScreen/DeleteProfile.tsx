import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image as img} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ScrollView} from 'react-native-gesture-handler';

import fonts from '../../assets/fonts';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import Modal from 'react-native-modal/dist/modal';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {socket} from '../../function/utility';
import {Authentication} from '../../datasource/AuthDatasource';
import Toast from 'react-native-toast-message';
import * as RootNavigation from '../../navigations/RootNavigation';

const DeleteProfile: React.FC<any> = ({navigation, route}) => {
  const windowWidth = Dimensions.get('window').width;
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(droner_id, ['WAIT_START', 'IN_PROGRESS'], 1, 999)
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
  const onLogout = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    socket.removeAllListeners(`send-task-${dronerId!}`);
    socket.close();
    await Authentication.logout();
  };

  const deleteProfile = async () => {
    setLoading(true);
    const droner_id = await AsyncStorage.getItem('droner_id');
    ProfileDatasource.deleteAccount(droner_id!)
      .then(res => {
        setLoading(false);
        setToggleModal(false);
        onLogout();
        RootNavigation.navigate('Auth', {
          screen: 'HomeScreen',
        });
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: `ขออภัยระบบขัดข้อง กรุณาลองอีกครั้ง`,
        });
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลบโปรไฟล์"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <ScrollView>
            <View>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: normalize(18),
                  color: 'black',
                }}>
                เงื่อนไขการลบบัญชี
              </Text>
            </View>
            <View style={{marginTop: normalize(10)}}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: 'black',
                }}>
                หากคุณมีงานที่กำลังดำเนินการ หรือรอเริ่มงาน
                คุณจะไม่สามารถลบบัญชีของคุณได้
              </Text>
            </View>

            <View style={{marginTop: normalize(60)}}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: colors.orange,
                }}>
                หากคุณมีปัญหาในการใช้งาน คุณสามารถติดต่อ call center :{' '}
                {callcenterNumber}
              </Text>
            </View>
          </ScrollView>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              disabled={task.length !== 0}
              style={{
                backgroundColor: task.length !== 0 ? colors.disable : 'red',
                paddingHorizontal: normalize(15),
                paddingVertical: normalize(10),
                borderRadius: 30,
              }}
              onPress={() => setToggleModal(!toggleModal)}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: fonts.medium,
                  fontSize: normalize(14),
                  color: 'white',
                }}>
                ลบบัญชี
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal isVisible={toggleModal}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: normalize(15),
            borderRadius: 12,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              ยืนยันการลบบัญชี?
            </Text>
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: normalize(14),
                color: 'black',
                marginBottom: 15,
              }}>
              กรุณากดยืนยันหากต้องการลบบัญชีการใช้งานนี้
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={{
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(10),
                borderRadius: 16,
                borderWidth: 0.5,
              }}
              onPress={() => setToggleModal(!toggleModal)}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: 'black',
                }}>
                ปิดหน้านี้
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(10),
                backgroundColor: 'red',
                borderRadius: 16,
              }}
              onPress={() => deleteProfile()}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(16),
                  color: 'white',
                }}>
                ยืนยันการลบบัญชี
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
export default DeleteProfile;

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
