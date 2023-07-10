import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {normalize} from '@rneui/themed';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FlatList} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import {colors, image, icons} from '../../assets';
import fonts from '../../assets/fonts';

import Tasklists from '../../components/TaskList/Tasklists';
import {TaskDatasource} from '../../datasource/TaskDatasource';

import {stylesCentral} from '../../styles/StylesCentral';
import * as ImagePicker from 'react-native-image-picker';
import {dataUpdateStatusEntity} from '../../entities/TaskScreenEntities';
import * as RootNavigation from '../../navigations/RootNavigation';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import MyProfileScreen from '../ProfileVerifyScreen/MyProfileScreen';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';

interface Prop {
  dronerStatus: string;
  scrollOffsetY: Animated.Value;
}

const TaskScreen: React.FC<Prop> = (props: Prop) => {
  const dronerStatus = props.dronerStatus;
  const scrollOffsetY = props.scrollOffsetY;
  const navigation = RootNavigation.navigate;
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState<boolean>(false);
  const [toggleModalStartTask, setToggleModalStartTask] =
    useState<boolean>(false);

  const [toggleModalReview, setToggleModalReview] = useState<boolean>(false);
  const [toggleModalSuccess, setToggleModalSuccess] = useState<boolean>(false);
  const [imgUploaded, setImgUploaded] = useState<boolean>(false);
  const [finishImg, setFinishImg] = useState<any>(null);
  const [defaultRating, setDefaultRating] = useState<number>(0);
  const [maxRatting, setMaxRatting] = useState<Array<number>>([1, 2, 3, 4, 5]);
  const [comment, setComment] = useState<string>('');
  const [imageFile, setImageFile] = useState<{
    file: any;
    fileDrug: any;
  }>();
  const [idUpload, setIdUpload] = useState<string>('');
  const [updateBy, setUpdateBy] = useState<string>('');
  const [percentSuccess, setPercentSuccess] = useState<number>(0);
  const [dataUpdateStatus, setDataUpdateStatus] =
    useState<dataUpdateStatusEntity>({
      id: '',
      dronerId: '',
      taskNo: '',
      updateBy: '',
    });
  const starImgFilled = icons.starfill;
  const starImgCorner = icons.starCorner;

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  useEffect(() => {
    getData();
  }, []);

  const startTask = () => {
    setLoading(true);
    setToggleModalStartTask(false);
    TaskDatasource.updateTaskStatus(
      dataUpdateStatus.id,
      dataUpdateStatus.dronerId,
      'IN_PROGRESS',
      dataUpdateStatus.updateBy,
    )
      .then(res => {
        Toast.show({
          type: 'success',
          text1: `งาน #${dataUpdateStatus.taskNo}`,
          text2: 'อัพเดทสถานะเรียบร้อยแล้ว',
        });
        setLoading(false);
        setTimeout(() => getData(), 300);
      })
      .catch(err => console.log(err.response.data));
  };

  const showModalStartTask = (
    id: string,
    dronerId: string,
    taskNo: string,
    updateBy: string,
  ) => {
    setDataUpdateStatus({
      id: id,
      dronerId: dronerId,
      taskNo: taskNo,
      updateBy: updateBy,
    });

    setToggleModalStartTask(true);
  };

  const openModalUpload = (name: string) => {
    setUpdateBy(name);
  };

  const onFinishTask = () => {
    setToggleModalReview(false);
    setTimeout(() => setLoading(true), 500);
    const payload = {
      taskId: idUpload,
      updateBy: updateBy,
      reviewFarmerComment: comment,
      reviewFarmerScore: defaultRating,
      file: imageFile?.file,
      fileDrug: imageFile?.fileDrug,
    };

    TaskDatasource.finishTask(payload)
      .then(res => {
        setLoading(false);
        setTimeout(() => setToggleModalSuccess(true), 200);
        setFinishImg(null);
        setDefaultRating(0);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        });
      });
  };

  const getData = async () => {
    setLoading(true);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(droner_id, ['WAIT_START', 'IN_PROGRESS'], 1, 999)
      .then(res => {
        if (res !== undefined) {
          setData(res);
          setCheckResIsComplete(true);
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });

    ProfileDatasource.getProfile(droner_id!).then(res => {
      setPercentSuccess(res.percentSuccess);
    });
  };

  const onPressSetTaskId = (id: string) => {
    setIdUpload(id);
  };

  const onChangImgFinish = (payloadFile: any) => {
    setImageFile(payloadFile);
    setTimeout(() => setToggleModalReview(true), 500);
  };
  const onCloseSuccessModal = () => {
    setToggleModalSuccess(false);
    setTimeout(() => navigation('TaskDetailScreen', {taskId: idUpload}), 500);
  };
  return (
    <>
      {data.length !== 0 && checkResIsComplete ? (
        <View style={[{flex: 1, backgroundColor: colors.grayBg, padding: 8}]}>
          <FlatList
            keyExtractor={element => element.item.taskNo}
            data={data}
            extraData={data}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
              {
                useNativeDriver: false,
              },
            )}
            renderItem={({item}: any) => {
              return (
                <Tasklists
                  {...item.item}
                  idTask={item.item.id}
                  onPressSetTaskId={onPressSetTaskId}
                  id={item.item.taskNo}
                  status={item.item.status}
                  title={item.item.farmerPlot.plantName}
                  price={
                    parseInt(item.item.price) +
                    parseInt(item.item.revenuePromotion)
                  }
                  date={item.item.dateAppointment}
                  address={item.item.farmerPlot.locationName}
                  distance={item.item.distance}
                  user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                  img={item.image_profile_url}
                  preparation={item.item.comment}
                  tel={item.item.farmer.telephoneNo}
                  taskId={item.item.id}
                  farmArea={item.item.farmAreaAmount}
                  toggleModalStartTask={toggleModalStartTask}
                  fetchTask={getData}
                  setToggleModalStartTask={setToggleModalStartTask}
                  setShowModalStartTask={() =>
                    showModalStartTask(
                      item.item.id,
                      item.item.dronerId,
                      item.item.taskNo,
                      `${item.item.droner.firstname} ${item.item.droner.lastname}`,
                    )
                  }
                  startTask={startTask}
                  maxRatting={maxRatting}
                  setDefaultRating={setDefaultRating}
                  defaultRating={defaultRating}
                  starImgFilled={starImgFilled}
                  starImgCorner={starImgCorner}
                  imgUploaded={imgUploaded}
                  finishImg={finishImg}
                  onChangImgFinish={onChangImgFinish}
                  toggleModalReview={toggleModalReview}
                  setComment={setComment}
                  comment={comment}
                  error={error}
                  toggleModalSuccess={toggleModalSuccess}
                  setToggleModalSuccess={setToggleModalSuccess}
                  onFinishTask={onFinishTask}
                  setToggleModalUpload={() =>
                    openModalUpload(
                      `${item.item.droner.firstname} ${item.item.droner.lastname}`,
                    )
                  }
                  onCloseSuccessModal={onCloseSuccessModal}
                />
              );
            }}
          />
          <View />
        </View>
      ) : (
        <>
          {dronerStatus === 'ACTIVE' ? (
            <View
              style={[
                stylesCentral.center,
                {flex: 1, backgroundColor: colors.grayBg, padding: 8},
              ]}>
              <Image
                source={image.blankTask}
                style={{width: normalize(136), height: normalize(111)}}
              />
              <Text style={stylesCentral.blankFont}>ยังไม่มีงานที่ต้องทำ</Text>
            </View>
          ) : (
            <View
              style={[
                stylesCentral.center,
                {flex: 1, backgroundColor: colors.grayBg, padding: 8},
              ]}></View>
          )}
          {dronerStatus == 'PENDING' ? (
            <View style={{backgroundColor: colors.grayBg}}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: normalize(10),
                  margin: normalize(10),
                  borderWidth: 2,
                  borderColor: colors.greyWhite,
                  borderRadius: 16,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      display: 'flex',
                      backgroundColor: '#FFF7F4',
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(5),
                      borderRadius: 16,
                    }}>
                    <Text
                      style={{
                        color: '#B16F05',
                        fontFamily: fonts.bold,
                        fontSize: normalize(16),
                      }}>
                      รอตรวจสอบเอกสาร
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingBottom: normalize(20),
                    marginTop: normalize(5),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(18),
                      color: 'black',
                    }}>
                    เจ้าหน้าที่กำลังตรวจสอบเอกสารการยืนยันตัวตน และ
                    โดรนของคุณอยู่ กรุณาตรวจสอบหากคุณยังไม่เพิ่มโดรน
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
          {dronerStatus == 'REJECTED' ? (
            <View style={{backgroundColor: colors.grayBg}}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: normalize(10),
                  margin: normalize(10),
                  borderWidth: 2,
                  borderColor: colors.greyWhite,
                  borderRadius: 16,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      display: 'flex',
                      backgroundColor: '#FFF7F4',
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(5),
                      borderRadius: 16,
                    }}>
                    <Text
                      style={{
                        color: '#B16F05',
                        fontFamily: fonts.bold,
                        fontSize: normalize(16),
                      }}>
                      ยืนยันตัวตนไม่สำเร็จ
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingBottom: normalize(20),
                    marginTop: normalize(5),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(18),
                      color: 'black',
                    }}>
                    โปรดติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข โทร.{' '}
                    {callcenterNumber}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
          {dronerStatus == 'OPEN' ? (
            <View style={{backgroundColor: colors.grayBg}}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: normalize(10),
                  margin: normalize(10),
                  borderWidth: 2,
                  borderColor: colors.greyWhite,
                  borderRadius: 16,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      display: 'flex',
                      backgroundColor: '#FFF7F4',
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(5),
                      borderRadius: 16,
                    }}>
                    <Text
                      style={{
                        color: '#B16F05',
                        fontFamily: fonts.bold,
                        fontSize: normalize(16),
                      }}>
                      รอยืนยันตัวตน
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingBottom: normalize(20),
                    marginTop: normalize(5),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(18),
                      color: 'black',
                    }}>
                    อีกนิดเดียว มากรอกข้อมูลโปรไฟล์ของคุณให้ ครบถ้วน
                    เพื่อเริ่มรับงานบินโดรนในระบบ
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image
                    source={
                      Number(percentSuccess) === 50
                        ? image.inprogress50
                        : Number(percentSuccess) === 75
                        ? image.inprogress75
                        : image.inprogress100
                    }
                    style={{
                      width: normalize(50),
                      height: normalize(50),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      navigation('MyProfileScreen', MyProfileScreen)
                    }>
                    <View style={styles.button}>
                      <Text style={styles.textButton}>เพิ่มข้อมูลโปรไฟล์</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </>
      )}
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </>
  );
};
export default TaskScreen;
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.orange,
    padding: 12,
    borderRadius: 20,
  },
  textButton: {
    fontFamily: fonts.bold,
    fontSize: normalize(14),
    color: colors.white,
  },
});
