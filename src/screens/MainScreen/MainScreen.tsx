import {Switch} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import TaskTapNavigator from '../../navigations/topTabs/TaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Avatar} from '@rneui/base';
import icons from '../../assets/icons/icons';
import io from 'socket.io-client';
import {SheetManager} from 'react-native-actions-sheet';
import {BASE_URL} from '../../config/develop-config';
import {TaskDatasource} from '../../datasource/TaskDatasource';

const MainScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [arr] = useState([1, 2, 3, 4]);
  const [profile, setProfile] = useState({
    name: '',
    lastname: '',
    image: '',
    isOpenReceiveTask: false,
  });
  const [dronerId, setDronerId] = useState<string>('');

  const socket = io(BASE_URL, {
    path: '/tasks/task/socket',
  });
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    getProfile();
    // getDronerId();
  }, []);

  useEffect(() => {
    getProfile();
    socket.on(`new-task-${dronerId}`, ({data}) => {
      SheetManager.show('NewTaskSheet', {
        payload: {
          data,
        },
      });
    });
  }, [dronerId]);

  const getProfile = async () => {
    const droner_id = await AsyncStorage.getItem('droner_id');
    ProfileDatasource.getProfile(droner_id!)
      .then(res => {
        const imgPath = res.file.filter((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        });
        if (imgPath.length != 0) {
          ProfileDatasource.getImgePathProfile(droner_id!, imgPath[0].path)
            .then(resImg => {
              setProfile({
                ...profile,
                name: res.firstname,
                image: resImg.url,
                isOpenReceiveTask: res.isOpenReceiveTask,
              });
            })
            .catch(err => console.log(err));
        } else {
          setProfile({
            ...profile,
            name: res.firstname,
            isOpenReceiveTask: res.isOpenReceiveTask,
          });
        }
      })
      .catch(err => console.log(err));
  };

  const getDronerId = async () => {
    setDronerId((await AsyncStorage.getItem('droner_id')) ?? '');
  };

  const openReceiveTask = async (isOpen: boolean) => {
    TaskDatasource.openReceiveTask(dronerId, isOpen)
      .then(res => {
        setProfile({...profile, isOpenReceiveTask: res.isOpenReceiveTask});
      })
      .catch(err => console.log(err));
  };

  return (
    <BottomSheetModalProvider>
      <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
        <View style={{flex: 2}}>
          <View style={styles.headCard}>
            <View>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                }}>
                สวัสดี, {profile.name}
              </Text>
              <View style={styles.activeContainer}>
                <Switch
                  color={colors.green}
                  value={profile.isOpenReceiveTask}
                  onValueChange={value => openReceiveTask(value)}
                />
                <Text style={styles.activeFont}>เปิดรับงาน</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProfileScreen', {
                    navbar: false,
                  });
                }}>
                <Avatar
                  size={50}
                  rounded
                  source={
                    profile.image != '' ? {uri: profile.image} : icons.account
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{height: normalize(95)}}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {arr.map(index => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.orange,
                      marginHorizontal: 5,
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                      width: 160,
                      height: 75,
                      borderRadius: 16,
                    }}>
                    <Text style={styles.font}>รายได้วันนี้</Text>
                    <Text style={styles.font}>0</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={{flex: 4}}>
          <TaskTapNavigator isOpenReceiveTask={profile.isOpenReceiveTask} />
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  headCard: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(23),
    paddingTop: normalize(5),
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBg,
    padding: normalize(5),
    borderRadius: normalize(12),
    marginTop: normalize(10),
  },
  activeFont: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    marginLeft: normalize(18),
    color: colors.fontBlack,
  },
  font: {
    fontFamily: font.medium,
    fontSize: normalize(20),
    color: colors.white,
  },
});
