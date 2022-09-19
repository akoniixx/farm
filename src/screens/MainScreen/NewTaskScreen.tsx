import {BottomSheetModal, TouchableOpacity} from '@gorhom/bottom-sheet';
import {normalize} from '@rneui/themed';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Dimensions, Image, Modal, StyleSheet, Text, View} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {colors, font, image} from '../../assets';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {stylesCentral} from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import NewTask from '../../components/TaskList/NewTask';
import {MainButton} from '../../components/Button/MainButton';
import icons from '../../assets/icons/icons';
import fonts from '../../assets/fonts';

const NewTaskScreen: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const snapPoints = useMemo(() => ['25%', '25%'], []);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const width = Dimensions.get('window').width;
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const getData = async () => {
    setLoading(false);
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(dronerId, ['WAIT_RECEIVE'], page, 4)
      .then(res => {
        if (res !== undefined) {
          setData(res);
          setCheckResIsComplete(true);
        }
      })
      .catch(err => console.log(err));
  };
  const receiveTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(selectedTaskId, dronerId, true)
      .then(res => {
        getData();
      })
      .catch(err => console.log(err));
  };
  const rejectTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(selectedTaskId, dronerId, false)
      .then(res => {
        getData();
      })
      .catch(err => console.log(err));
  };
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  return (
    <View style={[{flex: 1, backgroundColor: colors.grayBg, padding: 8}]}>
      {data.length == 0 && (
        <View
          style={[
            stylesCentral.center,
            {flex: 1, backgroundColor: colors.grayBg},
          ]}>
          <Image
            source={image.blankNewTask}
            style={{width: normalize(136), height: normalize(111)}}
          />
          <View style={{paddingHorizontal: normalize(40)}}>
            <Text style={stylesCentral.blankFont}>
              ยังไม่มีงานใหม่ เนื่องจากคุณปิดรับงานอยู่
              กรุณากดเปิดรับงานเพื่อที่จะไม่พลาดงานสำหรับคุณ!
            </Text>
          </View>
        </View>
      )}
      {data.length > 0 && (
        <View>
          <FlatList
            onEndReached={() => {
              setLoading(true);
              setPage(page + 1);
            }}
            keyExtractor={element => element.item.id}
            data={data}
            renderItem={({item}: any) => (
              <NewTask
                taskId={item.item.id}
                taskNo={item.item.taskNo}
                status={item.item.status}
                title={item.item.farmerPlot.plantName}
                price={item.item.totalPrice}
                date={item.item.dateAppointment}
                address={item.item.farmerPlot.locationName}
                distance={item.item.distance}
                user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                img={item.image_profile_url}
                preparation={item.item.preparationBy}
                tel={item.item.farmer.telephoneNo}
                updatedAt={item.item.updatedAt}
                // callFunc={handlePresentModalPress}
                // setTel={setTelNum}
                farmArea={item.item.farmAreaAmount}
                receiveTask={() => {
                  setSelectedTaskId(item.item.id);
                  setOpenConfirmModal(true);
                }}
                fetchData={() => getData()}
              />
            )}
          />
        </View>
      )}
      <Modal transparent={true} visible={openConfirmModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: normalize(20),
              backgroundColor: colors.white,
              width: width * 0.9,
              display: 'flex',
              justifyContent: 'center',
              borderRadius: normalize(8),
            }}>
            <View>
              <Text style={[styles.h2, {textAlign: 'center'}]}>
                ยืนยันการรับงาน?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setOpenConfirmModal(false);
                }}
                style={{
                  position: 'absolute',
                  top: normalize(4),
                  right: normalize(0),
                }}>
                <Image
                  source={icons.close}
                  style={{
                    width: normalize(14),
                    height: normalize(14),
                  }}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.label,
                  {textAlign: 'center', marginVertical: 5},
                ]}>
                กรุณากดยืนยันหากคุณต้องการรับงานนี้
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: normalize(10),
                width: '100%',
                height: normalize(50),
                borderRadius: normalize(8),
                backgroundColor: colors.orange,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                receiveTask().then(() => {
                  setOpenConfirmModal(false);
                });
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontWeight: '600',
                  fontSize: normalize(19),
                  color: '#ffffff',
                }}>
                รับงาน
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: normalize(10),
                width: '100%',
                height: normalize(50),
                borderRadius: normalize(8),
                borderWidth: 0.2,
                borderColor: 'grey',
                // backgroundColor: '#FB8705',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                rejectTask().then(() => {
                  setOpenConfirmModal(false);
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
      </Modal>
    </View>
  );
};
export default NewTaskScreen;

const styles = StyleSheet.create({
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
  },
});
