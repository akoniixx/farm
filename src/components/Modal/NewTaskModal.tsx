import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {normalize} from '@rneui/themed';
import {MainButton} from '../Button/MainButton';
import {colors, font, icons} from '../../assets';
import fonts from '../../assets/fonts';
import {numberWithCommas} from '../../function/utility';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import Toast from 'react-native-toast-message';

export const NewTaskModal = (
  props: SheetProps<{
    data: any;
  }>,
) => {
  const data = props.payload?.data;
  const date = new Date(data?.dateAppointment);
  const [position, setPosition] = useState({
    latitude: parseFloat(data?.farmerPlot.lat),
    longitude: parseFloat(data?.farmerPlot.long),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const openGps = (lat: number, lng: number, name: string) => {
    /*  var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${lat},${lng}`;
    Linking.openURL(url); */
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url || '');
  };

  const receiveTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(data?.id, dronerId, true)
      .then(res => {
        SheetManager.hide('NewTaskSheet');
        Toast.show({
          type: 'task',
          text1: `งาน #${data.taskNo} ถูกรับแล้ว`,
          text2: 'อย่าลืมติดต่อหาเกษตรกรก่อนเริ่มงาน',
        });
      })
      .catch(err => console.log(err));
  };
  const rejectTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(data?.id, dronerId, false)
      .then(res => {
        SheetManager.hide('NewTaskSheet');
        // Toast.show({
        //   type: 'task',
        //   text1: `งาน #${data.taskNo} ถูกรับแล้ว`,
        //   text2: 'อย่าลืมติดต่อหาเกษตรกรก่อนเริ่มงาน',
        // });
      })
      .catch(err => console.log(err));
  };

  const expire = new Date(new Date(data.updatedAt).getTime() + 30 * 60 * 1000);
  const now = new Date();
  const diff = new Date(expire.getTime() - now.getTime());
  const [minutes, setMinutes] = useState(diff.getMinutes());
  const [seconds, setSeconds] = useState(diff.getSeconds());
  useEffect(() => {
    let interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          SheetManager.hide('NewTaskSheet');
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <ActionSheet
      id={props.sheetId}
      useBottomSafeAreaPadding
      gestureEnabled={true}>
      <View style={styles.task}>
        {/* Task detail */}
        <View style={styles.taskDetail}>
          <View style={styles.title}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: normalize(14),
                color: '#9BA1A8',
              }}>
              {data?.taskNo}
            </Text>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FF981E',
                paddingHorizontal: normalize(12),
                paddingVertical: normalize(5),
                borderRadius: normalize(12),
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  color: '#FFFFFF',
                  fontSize: normalize(12),
                }}>
                งานใหม่
              </Text>
            </View>
          </View>
          <View style={styles.title}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: normalize(19),
              }}>
              {`${data?.farmerPlot.plantName} | ${data?.farmAreaAmount} ไร่`}
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: '#2EC66E',
                fontSize: normalize(17),
              }}>
              ฿ {data?.price ? numberWithCommas(data?.price) : null}
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
              }}>{`${date.getDate()}/${date.getMonth() + 1}/${
              date.getFullYear() + 543
            },${date.getHours()}:${date.getMinutes()} น.`}</Text>
          </View>
        </View>
        {/* Farmer detail */}
        <View style={styles.farmerDetail}>
          <View>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: normalize(19),
              }}>
              เกษตรกร
            </Text>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={
                  typeof data?.image_profile_url !== 'string'
                    ? icons.account
                    : {uri: data?.image_profile_url}
                }
                style={{
                  width: normalize(50),
                  height: normalize(50),
                }}
              />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  paddingLeft: normalize(8),
                  fontSize: normalize(14),
                }}>
                {`${data?.farmer.firstname} ${data?.farmer.lastname}`}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingVertical: normalize(5),
            }}>
            <Image
              source={icons.jobDistance}
              style={{
                width: normalize(20),
                height: normalize(20),
              }}
            />
            <View
              style={{
                paddingLeft: normalize(8),
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: normalize(14),
                }}>
                {data?.farmerPlot.locationName}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  color: '#9BA1A8',
                  fontSize: normalize(13),
                }}>
                ระยะทาง {data?.distance} กม.
              </Text>
            </View>
          </View>
        </View>
        {/* Map */}
        <View>
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
          </MapView.Animated>
          <TouchableOpacity
            style={styles.viewMap}
            onPress={() =>
              openGps(
                position.latitude,
                position.longitude,
                data?.farmerPlot.plotName,
              )
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
        </View>
        {/* Warning */}
        <View style={styles.warning}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: normalize(14),
              color: '#A5A7AB',
            }}>
            แจ้งให้ทราบ หากคุณปฏิเสธการรับงานบ่อยเกินไป อาจจะส่งผลให้กับ xxxx
          </Text>
        </View>
        {/* Button */}
        <View>
          <TouchableOpacity
            style={{
              width: normalize(343),
              height: normalize(54),
              borderRadius: normalize(8),
              backgroundColor: '#2EC66E',
              display: 'flex',
              flexDirection: 'row',
            }}
            onPress={() => {
              receiveTask();
            }}>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  paddingLeft: '10%',
                  fontFamily: fonts.medium,
                  fontWeight: '600',
                  fontSize: normalize(19),
                  color: '#ffffff',
                  textAlign: 'left',
                }}>
                รับงาน
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  padding: 3,
                  backgroundColor: '#014D40',
                  width: '45%',
                  left: '48%',
                  borderRadius: 39,
                }}>
                <Text
                  style={{
                    paddingRight: '10%',
                    fontFamily: fonts.medium,
                    fontWeight: '600',
                    fontSize: normalize(19),
                    color: '#ffffff',
                    textAlign: 'right',
                  }}>
                  {minutes + ':' + (seconds < 10 ? `0${seconds}` : seconds)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: normalize(343),
              height: normalize(54),
              borderRadius: normalize(8),
              borderWidth: 0.2,
              borderColor: 'grey',
              // backgroundColor: '#FB8705',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: normalize(10),
            }}
            onPress={() => {
              rejectTask().then(() => {
                // setOpenConfirmModal(false);
              });
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontWeight: '600',
                fontSize: normalize(19),
              }}>
              ไม่รับงาน
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  task: {
    padding: normalize(14),
    marginVertical: normalize(-20),
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  taskDetail: {
    padding: normalize(14),
    backgroundColor: '#FAFAFB',
    borderRadius: 16,
  },
  farmerDetail: {
    marginTop: normalize(-10),
    padding: normalize(14),
    paddingTop: normalize(0),
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  warning: {
    padding: normalize(14),
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
  },
  map: {
    width: normalize(344),
    height: normalize(129),
    // marginTop: normalize(10),
  },
  viewMap: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: colors.primaryBlue,
    borderWidth: 1,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(50),
  },
});
