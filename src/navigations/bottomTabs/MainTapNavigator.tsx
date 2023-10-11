import React, {useContext, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import messaging from '@react-native-firebase/messaging';
import {colors, font, icons} from '../../assets';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import {
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import MainTaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import RegisterNotification from '../../components/Modal/RegisterNotification';
import {TabActions, useIsFocused} from '@react-navigation/native';
import RegisterFailedModal from '../../components/Modal/RegisterFailedModalNotification';
import Toast from 'react-native-toast-message';
import {responsiveHeigth, responsiveWidth} from '../../function/responsive';
import * as RootNavigation from '../../navigations/RootNavigation';
import {ActionContext} from '../../../App';
import {dialCall} from '../../function/utility';
import RewardScreen from '../../screens/RewardScreen';
import MissionScreen from '../../screens/MissionScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyProfileScreen from '../../screens/ProfileVerifyScreen/MyProfileScreen';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {useAuth} from '../../contexts/AuthContext';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import {missionDatasource} from '../../datasource/MissionDatasource';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import {useMaintenance} from '../../contexts/MaintenanceContext';
import Text from '../../components/Text';

export type TabNavigatorParamList = {
  mission: undefined;
  home: undefined;
  myTask: undefined;
  reward: undefined;
  profile: undefined;
  CampaignScreen: undefined;
};
const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC<any> = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const {
    state: {isDoneAuth},
  } = useAuth();
  const width = useWindowDimensions().width;
  const belowMedium = width < 400;
  const [registerNoti, setRegisterNoti] = useState(false);
  const [registerfailedModalNoti, setRegisterFailedModalNoti] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('home');
  const {actiontaskId, setActiontaskId} = useContext(ActionContext);
  const [status, setStatus] = useState<any>();
  const isFocused = useIsFocused();

  const [campaignImage, setCampaignImage] = useState<string>('');
  const {checkDataMA} = useMaintenance();
  useEffect(() => {
    const getProfile = async () => {
      const droner_id = await AsyncStorage.getItem('droner_id');

      ProfileDatasource.getProfile(droner_id!).then(res => {
        setStatus(res.status);
      });
    };
    getProfile();
  }, [isFocused]);
  const ListPath = [
    {
      name: 'home',
      title: 'หน้าหลัก',
      component: MainScreen,
      activeIcon: icons.home_active,
      inactiveIcon: icons.home,
    },
    {
      name: 'myTask',
      title: 'งานของฉัน',
      component: MainTaskScreen,
      activeIcon: icons.task_active,
      inactiveIcon: icons.task,
    },
    {
      name: 'mission',
      title: 'ภารกิจ',
      component: MissionScreen,
      activeIcon: icons.mission_active,
      inactiveIcon: icons.mission,
    },
    {
      name: 'reward',
      title: 'รีวอร์ด',
      component: RewardScreen,
      activeIcon: icons.giftActive,
      inactiveIcon: icons.gift,
    },
    {
      name: 'profile',
      title: 'โปรไฟล์',
      component: status === 'OPEN' ? MyProfileScreen : ProfileScreen,
      activeIcon: isDoneAuth
        ? icons.profileActive
        : icons.profileActiveNotDoneDoc,
      inactiveIcon: isDoneAuth ? icons.profile : icons.profileNotDoneDoc,
    },
  ];

  useEffect(() => {
    const checkStatusTask = async (taskId: string, taskNo: string) => {
      const dronerId = await AsyncStorage.getItem('droner_id');
      const result = await TaskDatasource.getTaskDetail(taskId, dronerId || '');
      if (result && result?.responseData?.data?.dronerId) {
        RootNavigation.navigate('Main', {
          screen: 'MainScreen',
        });
        Toast.show({
          type: 'taskAlreadyAccepted',
          onPress: () => {
            Toast.hide();
          },
          text1: `ขออภัย งานหมายเลข #${taskNo}`,
        });
      } else {
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: taskId},
        });
      }
    };
    messaging()
      .getInitialNotification()
      .then(async message => {
        if (message) {
          const type = message.data?.type;
          await analytics().logEvent('notification_opened', {
            type: type,
            ...message.data,
          });

          switch (type) {
            case 'APPROVE_DRONER_SUCCESS':
              setInitialRouteName('profile');
              setRegisterNoti(true);
              break;
            case 'APPROVE_DRONER_FAIL':
              setInitialRouteName('profile');
              setRegisterFailedModalNoti(true);
              break;
            case 'APPROVE_DRONER_DRONE_FAIL':
              setInitialRouteName('profile');
              break;
            case 'APPROVE_ADDITION_DRONER_DRONE_SUCCESS':
              setInitialRouteName('profile');
              break;
            case 'APPROVE_ADDITION_DRONER_DRONE_FAIL':
              setInitialRouteName('profile');
              break;
            case 'NEW_TASK':
              checkStatusTask(
                message.data?.taskId || '',
                message?.data?.taskNo || '',
              );
              break;
            case 'FIRST_REMIND':
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              break;
            case 'SECOND_REMIND':
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              break;
            case 'THIRD_REMIND':
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              break;
            case 'FORTH_REMIND':
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              break;
            case 'DONE_TASK_REMIND':
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              break;
            case 'FORCE_SELECT_DRONER':
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              break;
            case 'RECEIVE_POINT':
              RootNavigation.navigate('Main', {
                screen: 'receivePoint',
              });
              break;
            case 'MISSION_REWARD_PHYSICAL':
              const dronerId = await AsyncStorage.getItem('droner_id');
              const payload = {
                page: 1,
                take: 10,
                dronerId: dronerId || '',
              };
              missionDatasource.getListMissions(payload).then(res => {
                const mission = res.mission.filter(
                  (item: any) => item.id === message.data?.campaignId,
                );
                const condition =
                  mission[0].condition[parseInt(message.data?.index!)];
                const isComplete = condition.allRai >= condition.rai;
                const current =
                  condition.allRai > condition.rai
                    ? condition.rai
                    : condition.allRai;
                const isExpired = moment().isAfter(mission.endDate);
                const isStatusComplete = condition.status === 'COMPLETE';
                RootNavigation.navigate('Main', {
                  screen: 'MissionDetailScreen',
                  params: {
                    data: {
                      ...condition,
                      isComplete,
                      current,
                      isExpired,
                      isStatusComplete,
                      status: condition.status,
                      missionName: condition.missionName,
                      reward: condition.reward,
                      endDate: mission.endDate,
                      total: condition.rai,
                      conditionReward: condition.conditionReward,
                      descriptionReward: condition.descriptionReward,
                      num: condition.num,
                      missionId: condition.missionId,
                    },
                  },
                });
              });
              break;
            case 'MISSION_POINT':
              RootNavigation.navigate('Main', {
                screen: 'MissionScreen',
              });
              break;
            default:
              break;
          }
        }
        setLoading(false);
      });
    messaging().onNotificationOpenedApp(async message => {
      const type = message.data?.type;
      await analytics().logEvent('notification_opened', {
        type: type,
        ...message.data,
      });

      const jumpAction = TabActions.jumpTo('profile');
      switch (type) {
        case 'APPROVE_DRONER_SUCCESS':
          setRegisterNoti(true);
          break;
        case 'APPROVE_DRONER_FAIL':
          setRegisterFailedModalNoti(true);
          break;
        case 'APPROVE_DRONER_DRONE_FAIL':
          navigation.dispatch(jumpAction);
          break;
        case 'APPROVE_ADDITION_DRONER_DRONE_SUCCESS':
          navigation.dispatch(jumpAction);
          break;
        case 'APPROVE_ADDITION_DRONER_DRONE_FAIL':
          navigation.dispatch(jumpAction);
          break;
        case 'NEW_TASK':
          checkStatusTask(
            message.data?.taskId || '',
            message?.data?.taskNo || '',
          );
          break;
        case 'FIRST_REMIND':
          RootNavigation.navigate('Main', {
            screen: 'TaskDetailScreen',
            params: {taskId: message.data?.taskId},
          });
          break;
        case 'SECOND_REMIND':
          RootNavigation.navigate('Main', {
            screen: 'TaskDetailScreen',
            params: {taskId: message.data?.taskId},
          });
          break;
        case 'THIRD_REMIND':
          RootNavigation.navigate('Main', {
            screen: 'TaskDetailScreen',
            params: {taskId: message.data?.taskId},
          });
          break;
        case 'FORTH_REMIND':
          RootNavigation.navigate('Main', {
            screen: 'TaskDetailScreen',
            params: {taskId: message.data?.taskId},
          });
          break;
        case 'DONE_TASK_REMIND':
          RootNavigation.navigate('Main', {
            screen: 'TaskDetailScreen',
            params: {taskId: message.data?.taskId},
          });
          break;
        case 'FORCE_SELECT_DRONER':
          RootNavigation.navigate('Main', {
            screen: 'TaskDetailScreen',
            params: {taskId: message.data?.taskId},
          });
          break;
        case 'RECEIVE_POINT':
          RootNavigation.navigate('Main', {
            screen: 'receivePoint',
          });
          break;
        case 'MISSION_REWARD_PHYSICAL':
          const dronerId = await AsyncStorage.getItem('droner_id');
          const payload = {
            page: 1,
            take: 10,
            dronerId: dronerId || '',
          };
          missionDatasource.getListMissions(payload).then(res => {
            const mission = res.mission.filter(
              (item: any) => item.id === message.data?.campaignId,
            );
            const condition =
              mission[0].condition[parseInt(message.data?.index!)];
            const isComplete = condition.allRai >= condition.rai;
            const current =
              condition.allRai > condition.rai
                ? condition.rai
                : condition.allRai;
            const isExpired = moment().isAfter(mission.endDate);
            const isStatusComplete = condition.status === 'COMPLETE';
            RootNavigation.navigate('Main', {
              screen: 'MissionDetailScreen',
              params: {
                data: {
                  ...condition,
                  isComplete,
                  current,
                  isExpired,
                  isStatusComplete,
                  status: condition.status,
                  missionName: condition.missionName,
                  reward: condition.reward,
                  endDate: mission.endDate,
                  total: condition.rai,
                  conditionReward: condition.conditionReward,
                  descriptionReward: condition.descriptionReward,
                  num: condition.num,
                  missionId: condition.missionId,
                },
              },
            });
          });
          break;
        case 'MISSION_POINT':
          RootNavigation.navigate('Main', {
            screen: 'MissionScreen',
          });
          break;
        default:
          break;
        case 'NOTIFICATION_MAINTAIN_DRONER':
          checkDataMA();
          break;
      }
    });

    messaging().onMessage(async message => {
      const type = message.data?.type;
      await analytics().logEvent('notification_received', {
        type: type,
        ...message.data,
      });

      switch (type) {
        case 'APPROVE_DRONER_SUCCESS':
          setRegisterNoti(true);
          break;
        case 'APPROVE_DRONER_FAIL':
          Toast.show({
            type: 'registerFailed',
            topOffset: 10,
            position: 'top',
            onPress() {
              const jumpAction = TabActions.jumpTo('profile');
              navigation.dispatch(jumpAction);
              Toast.hide();
            },
          });
          break;
        case 'APPROVE_DRONER_DRONE_SUCCESS':
          Toast.show({
            type: 'droneSuccess',
            topOffset: 10,
            text1: message.data?.serialNo,
            position: 'top',
            onPress() {
              const jumpAction = TabActions.jumpTo('profile');
              navigation.dispatch(jumpAction);
              Toast.hide();
            },
          });
          break;
        case 'APPROVE_DRONER_DRONE_FAIL':
          Toast.show({
            type: 'droneFailed',
            text1: message.data?.serialNo,
            topOffset: 10,
            position: 'top',
            onPress() {
              const jumpAction = TabActions.jumpTo('profile');
              navigation.dispatch(jumpAction);
              Toast.hide();
            },
          });
          break;
        case 'RECEIVE_TASK_SUCCESS':
          Toast.show({
            type: 'receiveTaskSuccess',
            text1: `งาน #${message.data?.taskNo}`,
            text2: `วันที่ ${
              message.data?.dateAppointment.split('T')[0].split('-')[2]
            }/${message.data?.dateAppointment.split('T')[0].split('-')[1]}/${
              parseInt(
                message.data?.dateAppointment.split('T')[0].split('-')[0]!,
              ) + 543
            } เวลา ${
              parseInt(
                message.data?.dateAppointment.split('T')[1].split(':')[0]!,
              ) +
                7 >
              9
                ? `${
                    parseInt(
                      message.data?.dateAppointment
                        .split('T')[1]
                        .split(':')[0]!,
                    ) + 7
                  }`
                : `0${
                    parseInt(
                      message.data?.dateAppointment
                        .split('T')[1]
                        .split(':')[0]!,
                    ) + 7
                  }`
            }:${message.data?.dateAppointment.split('T')[1].split(':')[1]}`,
            onPress: () => {
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              Toast.hide();
            },
          });
          break;
        case 'RECEIVE_TASK_FAIL':
          setActiontaskId(message.data?.taskId!);
          Toast.show({
            type: 'taskFailed',
            topOffset: 10,
            text1: `${message.data?.title}`,
            position: 'top',
            onPress() {
              Toast.hide();
            },
          });
          break;
        case 'FIRST_REMIND':
          Toast.show({
            type: 'taskWarningContactFarmer',
            topOffset: 10,
            position: 'top',
            onPress() {
              Toast.hide();
            },
          });
          break;
        case 'SECOND_REMIND':
          let date_secondremind = message.data?.dateAppointment.split('T');
          Toast.show({
            type: 'taskWarningContactFarmerTowmorow',
            topOffset: 10,
            position: 'top',
            text1: `วันที่ ${date_secondremind![0].split('-')[2]}/${
              date_secondremind![0].split('-')[1]
            }/${parseInt(date_secondremind![0].split('-')[0]) + 543} เวลา ${
              parseInt(date_secondremind![1].split(':')[0]) + 7 > 9
                ? `0${parseInt(date_secondremind![1].split(':')[0]) + 7}`
                : parseInt(date_secondremind![1].split(':')[0]) + 7
            }.${parseInt(date_secondremind![1].split(':')[1])}น.`,
            onPress() {
              Toast.hide();
            },
          });
          break;
        case 'THIRD_REMIND':
          Toast.show({
            type: 'taskWarningBeforeOneHours',
            topOffset: 10,
            position: 'top',
            onPress() {
              Toast.hide();
            },
          });
          break;
        case 'FORTH_REMIND':
          Toast.show({
            type: 'taskWarningStartJob',
            topOffset: 10,
            position: 'top',
            onPress() {
              Toast.hide();
            },
          });
          break;
        case 'DONE_TASK_REMIND':
          Toast.show({
            type: 'taskWarningJobSuccess',
            topOffset: 10,
            position: 'top',
            onPress() {
              Toast.hide();
            },
          });
          break;
        case 'FORCE_SELECT_DRONER':
          let date_force_select = message.data?.dateAppointment.split('T');
          Toast.show({
            type: 'taskJobSuccess',
            topOffset: 10,
            text1: `#${message.data?.taskNo}`,
            text2: `วันที่ ${date_force_select![0].split('-')[2]}/${
              date_force_select![0].split('-')[1]
            }/${parseInt(date_force_select![0].split('-')[0]) + 543} เวลา ${
              parseInt(date_force_select![1].split(':')[0]) + 7 > 9
                ? `0${parseInt(date_force_select![1].split(':')[0]) + 7}`
                : parseInt(date_force_select![1].split(':')[0]) + 7
            }.${parseInt(date_force_select![1].split(':')[1])}น.`,
            position: 'top',
            onPress() {
              RootNavigation.navigate('Main', {
                screen: 'TaskDetailScreen',
                params: {taskId: message.data?.taskId},
              });
              Toast.hide();
            },
          });
          break;
        case 'RECEIVE_POINT':
          Toast.show({
            type: 'receivePoint',
            topOffset: 40,
            position: 'top',
            text1: message.data?.point,
            onPress() {
              RootNavigation.navigate('Main', {
                screen: 'PointHistoryScreen',
              });
              Toast.hide();
            },
          });
          break;
        case 'MISSION_REWARD_PHYSICAL':
          const dronerId = await AsyncStorage.getItem('droner_id');
          const payload = {
            page: 1,
            take: 10,
            dronerId: dronerId || '',
          };
          missionDatasource.getListMissions(payload).then(res => {
            const mission = res.mission.filter(
              (item: any) => item.id === message.data?.campaignId,
            );
            const condition =
              mission[0].condition[parseInt(message.data?.index!)];
            const isComplete = condition.allRai >= condition.rai;
            const current =
              condition.allRai > condition.rai
                ? condition.rai
                : condition.allRai;
            const isExpired = moment().isAfter(mission.endDate);
            const isStatusComplete = condition.status === 'COMPLETE';
            Toast.show({
              type: 'missionDone',
              topOffset: 40,
              position: 'top',
              text1: message.data?.message,
              onPress() {
                RootNavigation.navigate('Main', {
                  screen: 'MissionDetailScreen',
                  params: {
                    data: {
                      ...condition,
                      isComplete,
                      current,
                      isExpired,
                      isStatusComplete,
                      status: condition.status,
                      missionName: condition.missionName,
                      reward: condition.reward,
                      endDate: mission.endDate,
                      total: condition.rai,
                      conditionReward: condition.conditionReward,
                      descriptionReward: condition.descriptionReward,
                      num: condition.num,
                      missionId: condition.missionId,
                    },
                  },
                });
                Toast.hide();
              },
            });
          });
          break;
        case 'MISSION_POINT':
          Toast.show({
            type: 'missionPointDone',
            topOffset: 40,
            position: 'top',
            text1: message.data?.message,
            onPress() {
              RootNavigation.navigate('Main', {
                screen: 'MissionScreen',
              });
              Toast.hide();
            },
          });
          break;
        default:
          break;
        case 'NOTIFICATION_MAINTAIN_DRONER':
          checkDataMA();
          break;
      }
    });
  }, []);

  if (loading) {
    return <></>;
  }
  return (
    <>
      <RegisterNotification
        value={registerNoti}
        onClick={() => {
          setRegisterNoti(false);
          setInitialRouteName('home');
          const jumpAction = TabActions.jumpTo('profile');
          navigation.dispatch(jumpAction);
        }}
        onClose={() => {
          setRegisterNoti(false);
        }}
      />
      <RegisterFailedModal
        value={registerfailedModalNoti}
        onClick={() => {
          setRegisterFailedModalNoti(false);
          dialCall();
        }}
        onClose={() => {
          setRegisterFailedModalNoti(false);
        }}
      />

      <Tab.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRouteName}>
        {ListPath.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.name}
              component={item.component}
              options={{
                tabBarLabelStyle: {
                  fontFamily: font.medium,
                },
                tabBarStyle: {
                  minHeight: Platform.OS === 'ios' ? 95 : 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                lazy: true,
                tabBarButton(props) {
                  const isFocused = props.accessibilityState?.selected;
                  const isProfileDone = item.name === 'profile' && isDoneAuth;
                  return (
                    <TouchableOpacity
                      {...props}
                      style={[
                        props?.style,
                        {
                          padding: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            isFocused ? item.activeIcon : item.inactiveIcon
                          }
                          resizeMode="contain"
                          style={
                            isProfileDone
                              ? {
                                  width: 22,
                                  height: 22,
                                  marginTop: 1.5,
                                }
                              : {width: 25, height: 25}
                          }
                        />

                        <Text
                          style={{
                            fontFamily: fonts.medium,
                            fontSize:
                              Platform.OS === 'android'
                                ? 12
                                : belowMedium
                                ? normalize(12)
                                : normalize(14),
                            color: isFocused ? colors.orange : colors.gray,
                            marginTop: isProfileDone ? 4 : 2,
                          }}>
                          {item.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                },
              }}
            />
          );
        })}
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height:
      Platform.OS === 'ios' ? responsiveHeigth(170) : responsiveWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainTapNavigator;
