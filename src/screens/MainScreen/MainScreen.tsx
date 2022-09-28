import {Switch} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
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
import { useFocusEffect } from '@react-navigation/native';
import { decimalConvert, numberWithCommas, socket } from '../../function/utility';

const MainScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({
    name: '',
    lastname: '',
    image : '',
    totalRevenue : '0',
    totalRevenueToday : '0',
    totalArea : '0',
    totalTask : '0',
    ratingAvg : '0.00',
    isOpenReceiveTask: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      openSocket();
    }, []),
  );

  useEffect(() => {
    getProfile();
  }, []);

  const openSocket = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    socket.on(`new-task-${dronerId!}`, ({data, image_profile_url}) => {
      SheetManager.show('NewTaskSheet', {
        payload: {
          data,
          dronerId,
          image_profile_url,
        },
      });
    });
  };

  const getProfile = async () => {
    const droner_id = await AsyncStorage.getItem('droner_id');
    ProfileDatasource.getProfile(droner_id!)
      .then(res => {
        const imgPath = res.file.filter((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        })
        if(imgPath.length !=0){
          ProfileDatasource.getTaskrevenuedroner().then(
            resRev => {
              ProfileDatasource.getImgePathProfile(droner_id!,imgPath[0].path).then(
                resImg => {
                  setProfile({
                    ...profile,
                    name: res.firstname,
                    image: resImg.url,
                    totalRevenue : resRev.totalRevenue,
                    totalRevenueToday : resRev.totalRevenueToday,
                    totalArea : resRev.totalArea,
                    totalTask : resRev.totalTask,
                    ratingAvg : (!resRev.ratingAvg)?"0.00":((parseFloat(resRev.ratingAvg)).toFixed(2)).toString(),
                    isOpenReceiveTask: res.isOpenReceiveTask,
                  });
                }
              ).catch(err => console.log(err));
            }
          ).catch(err => console.log(err));
        }
        else{
          ProfileDatasource.getTaskrevenuedroner().then(
            resRev => {
              setProfile({
                ...profile,
                name: res.firstname,
                totalRevenue : resRev.totalRevenue,
                totalRevenueToday : resRev.totalRevenueToday,
                totalArea : resRev.totalArea,
                totalTask : resRev.totalTask,
                ratingAvg : (!resRev.ratingAvg)?"0.00":((parseFloat(resRev.ratingAvg)).toFixed(2)).toString(),
                isOpenReceiveTask: res.isOpenReceiveTask,
              });
            }
          ).catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  const openReceiveTask = async (isOpen: boolean) => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    TaskDatasource.openReceiveTask(dronerId!, isOpen)
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
                  trackColor={{ false: "#767577", true: colors.green }}
                  thumbColor={profile.isOpenReceiveTask ? "white" : "#f4f3f4"}
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
                <View style={{
                  width : normalize(50),
                  height : normalize(65),
                  position : 'relative',
                }}>
                  <Avatar size={normalize(50)} rounded source={(profile.image != '')?{uri : profile.image}:icons.account}/>
                  <View style={{
                    width : normalize(50),
                    height : normalize(16),
                    borderRadius : normalize(8),
                    position : 'absolute',
                    left : normalize(0),
                    top : normalize(43),
                    backgroundColor : colors.fontBlack,
                    display : 'flex',
                    flexDirection : 'row',
                    alignItems : 'center',
                    justifyContent : 'center'
                  }}>
                    <Text style={{
                      fontFamily : font.medium,
                      fontSize : normalize(12),
                      color : colors.white,
                      paddingRight : normalize(2)
                    }}>{`${profile.ratingAvg}`}</Text>
                    <Image source={icons.review} style={{
                          width : normalize(12),
                          height : normalize(12)
                        }}/>
                  </View>
                </View>
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
                <View
                  style={{
                    backgroundColor: colors.orange,
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical : normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                  <View style={{
                    flexDirection : 'row',
                    alignItems : 'center'
                  }}>
                    <Image source={icons.income} style={styles.iconsTask}/>
                    <Text style={styles.font}>รายได้วันนี้</Text>
                  </View>
                  <Text style={styles.font}>{`฿${numberWithCommas(profile.totalRevenueToday)}`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#6B7580',
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical : normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                    <View style={{
                    flexDirection : 'row',
                    alignItems : 'center'
                    }}>
                        <Image source={icons.income} style={styles.iconsTask}/>
                        <Text style={styles.font}>รายได้ทั้งหมด</Text>
                    </View>
                  <Text style={styles.font}>{`฿${numberWithCommas(profile.totalRevenue)}`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#37ABFF',
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical : normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                    <View style={{
                    flexDirection : 'row',
                    alignItems : 'center'
                    }}>
                      <Image source={icons.farm} style={styles.iconsTask}/>
                      <Text style={styles.font}>ไร่สะสม</Text>
                    </View>
                  <Text style={styles.font}>{`${profile.totalArea} ไร่`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#3EBD93',
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical : normalize(10),
                    justifyContent: 'space-between',
                    width: 160,
                    height: 75,
                    borderRadius: 16,
                  }}>
                    <View style={{
                    flexDirection : 'row',
                    alignItems : 'center'
                    }}>
                      <Image source={icons.dronejob} style={styles.iconsTask}/>
                      <Text style={styles.font}>งานที่บินเสร็จ</Text>
                    </View>
                  <Text style={styles.font}>{`${profile.totalTask} งาน`}</Text>
                </View>
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
    fontSize: normalize(16),
    color: colors.white,
  },
  iconsTask : {
    width : normalize(20),
    height : normalize(20),
    marginRight : normalize(5)
  }
});
