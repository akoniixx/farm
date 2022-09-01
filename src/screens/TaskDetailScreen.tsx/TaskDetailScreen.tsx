import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import fonts from '../../assets/fonts';
import {
  dialCall,
  getStatusToText,
  numberWithCommas,
} from '../../function/utility';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {CallingModal} from '../../components/Modal/CallingModal';
import {WaitStartFooter} from '../../components/Footer/WaitStartFooter';
import {InprogressFooter} from '../../components/Footer/InprogressFooter';

const TaskDetailScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const taskId = route.params.taskId;
  const [data, setData] = useState<any>();
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  /* const tokyoRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }; */

  useEffect(() => {
    getTaskDetail();
  }, []);

  const updateTask = (status: string) => {
    TaskDatasource.updateTaskStatus(
      data.id,
      data.droner.id,
      status === 'WAIT_START' ? 'IN_PROGRESS' : 'DONE',
    )
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err.response.data));
  };

  const getTaskDetail = () => {
    TaskDatasource.getTaskDetail(taskId)
      .then(res => {
        console.log(res);
        setData(res.data);
        setPosition({
          latitude: parseFloat(res.data.farmerPlot.lat),
          longitude: parseFloat(res.data.farmerPlot.long),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })
      .catch(err => console.log(err));
  };
  const convertDate = (date: string) => {
    const cdate = new Date(date);
    return cdate;
  };

  const openGps = (lat: number, lng: number) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${lat},${lng}`;
    Linking.openURL(url);
  };

  // variables
  const snapPoints = useMemo(() => ['25%', '25%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  return (
    <BottomSheetModalProvider>
      <View style={{flex: 1}}>
        <CustomHeader
          title="รายละเอียดงาน"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />

        {data ? (
          <>
            <ScrollView>
              <View style={styles.taskMenu}>
                <View style={styles.listTile}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(14),
                      color: '#9BA1A8',
                    }}>
                    #{data.taskNo}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: getStatusToText(data.status)?.bgcolor,
                      paddingHorizontal: normalize(12),
                      paddingVertical: normalize(5),
                      borderRadius: normalize(12),
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        color: getStatusToText(data.status)?.color,
                        fontSize: normalize(12),
                      }}>
                      {getStatusToText(data.status)?.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.listTile}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(19),
                    }}>
                    {data.farmerPlot.plantName}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      color: '#2EC66E',
                      fontSize: normalize(17),
                    }}>
                    ฿{' '}
                    {data.totalPrice ? numberWithCommas(data.totalPrice) : null}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingVertical: normalize(5),
                  }}>
                  <Image
                    source={icons.jobCard}
                    style={{
                      width: normalize(20),
                      height: normalize(20),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      paddingLeft: normalize(8),
                      fontSize: normalize(14),
                    }}>{`${convertDate(data.dateAppointment).getDate()}/${
                    convertDate(data.dateAppointment).getMonth() + 1
                  }/${
                    convertDate(data.dateAppointment).getFullYear() + 543
                  },${convertDate(
                    data.dateAppointment,
                  ).getHours()}:${convertDate(
                    data.dateAppointment,
                  ).getMinutes()} น.`}</Text>
                </View>
              </View>
              <View style={styles.taskMenu}>
                <View style={styles.listTile}>
                  <Text style={styles.font16}>รายละเอียดงาน</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={styles.fontGray}>พืช</Text>
                    <Text style={styles.font16}>
                      {data.farmerPlot.plantName}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.fontGray}>พื้นที่</Text>
                    <Text style={styles.font16}>{data.farmAreaAmount} ไร่</Text>
                  </View>
                  <View>
                    <Text style={styles.fontGray}>ปุ๋ย/ยา</Text>
                    <Text style={styles.font16}>{data.preparationBy}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{backgroundColor: colors.white, padding: normalize(15)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="edit"
                    size={13}
                    color="black"
                    style={{marginRight: 20}}
                  />
                  <Text style={styles.fontGray}>
                    {data.statusRemark ? data.statusRemark : '-'}
                  </Text>
                </View>
              </View>
              <View style={styles.taskMenu}>
                <View style={styles.listTile}>
                  <Text style={styles.font16}>เกษตรกร</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={icons.account}
                      style={{width: normalize(24), height: normalize(24)}}
                    />
                    <Text
                      style={{
                        marginLeft: normalize(5),
                        fontFamily: font.medium,
                        color: 'black',
                        fontSize: normalize(15),
                      }}>
                      {`${data.farmer.firstname}` +
                        ' ' +
                        `${data.farmer.lastname}`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => dialCall(data.farmer.telephoneNo)}
                    style={styles.callFarmer}>
                    <Image
                      source={icons.calling}
                      style={{height: 20, width: 20}}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginTop: normalize(10)}}>
                  <Image
                    source={icons.jobDistance}
                    style={{width: normalize(24), height: normalize(24)}}
                  />
                  <View style={{marginLeft: normalize(5)}}>
                    <Text
                      style={{
                        fontFamily: font.medium,
                        color: 'black',
                        fontSize: normalize(15),
                      }}>
                      {data.farmerPlot.plotArea}
                      {/*  {`เทส` + `` + ``} */}
                    </Text>
                    <Text
                      style={{
                        fontFamily: font.light,
                        color: colors.gray,
                        fontSize: normalize(13),
                      }}>
                      ระยะทาง {data.distance} กม.
                    </Text>
                  </View>
                </View>
                <MapView.Animated
                  style={styles.map}
                  zoomEnabled={false}
                  zoomTapEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  scrollEnabled={false}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={position}>
                  <Marker coordinate={position} />

                  <TouchableOpacity
                    style={styles.viewMap}
                    onPress={() =>
                      openGps(position.latitude, position.longitude)
                    }>
                    <Image
                      source={icons.direction}
                      style={{width: normalize(24), height: normalize(24)}}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontFamily: font.medium,
                        color: 'black',
                      }}>
                      ดูแผนที่
                    </Text>
                  </TouchableOpacity>
                </MapView.Animated>
              </View>
            </ScrollView>

            {data.status === 'WAIT_START' ? (
              <WaitStartFooter
                mainFunc={() => updateTask(data.status)}
                togleModal={() => handlePresentModalPress()}
              />
            ) : (
              <InprogressFooter
                mainFunc={() => updateTask(data.status)}
                togleModal={() => handlePresentModalPress()}
              />
            )}

            <View>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}>
                <CallingModal tel={data.farmer.telephoneNo} />
              </BottomSheetModal>
            </View>
          </>
        ) : null}
      </View>
    </BottomSheetModalProvider>
  );
};
export default TaskDetailScreen;
const styles = StyleSheet.create({
  taskMenu: {
    backgroundColor: '#fff',
    padding: normalize(15),
    marginVertical: normalize(5),
  },
  listTile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  font16: {
    fontFamily: fonts.medium,
    fontSize: normalize(16),
  },
  fontGray: {
    fontFamily: font.medium,
    fontSize: normalize(15),
    color: colors.gray,
  },
  map: {
    width: normalize(344),
    height: normalize(190),
    marginTop: normalize(10),
  },
  viewMap: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    top: '40%',
    backgroundColor: 'white',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(50),
  },
  startButton: {
    width: normalize(275),
    height: normalize(52),
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
  callFarmer: {
    width: 32,
    height: 32,
    backgroundColor: '#D7F2FF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
