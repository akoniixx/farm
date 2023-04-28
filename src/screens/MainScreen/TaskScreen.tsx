import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {normalize} from '@rneui/themed';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';

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
import { callcenterNumber } from '../../definitions/callCenterNumber';

interface Prop {
  dronerStatus: string;
}

const TaskScreen: React.FC<Prop> = (props: Prop) => {
  const dronerStatus = props.dronerStatus;
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState<boolean>(false);
  const [toggleModalStartTask, setToggleModalStartTask] =
    useState<boolean>(false);

  const [toggleModalUpload, setToggleModalUpload] = useState<boolean>(false);
  const [toggleModalReview, setToggleModalReview] = useState<boolean>(false);
  const [toggleModalSuccess, setToggleModalSuccess] = useState<boolean>(false);
  const [imgUploaded, setImgUploaded] = useState<boolean>(false);
  const [finishImg, setFinishImg] = useState<any>(null);
  const [defaultRating, setDefaultRating] = useState<number>(0);
  const [maxRatting, setMaxRatting] = useState<Array<number>>([1, 2, 3, 4, 5]);
  const [comment, setComment] = useState<string>('');
  const [idUpload, setIdUpload] = useState<string>('');
  const [updateBy, setUpdateBy] = useState<string>('');
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

  const openModalUpload = (id: string, updateBy: string) => {
    setIdUpload(id);
    setUpdateBy(updateBy);
    setToggleModalUpload(true);
  };

  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel) {
      setFinishImg(result);
      setImgUploaded(true);
    }
  }, [finishImg]);
  const onFinishTask = () => {
    setToggleModalReview(false);
    setTimeout(() => setLoading(true), 500);
    TaskDatasource.finishTask(
      finishImg,
      idUpload,
      defaultRating,
      comment,
      updateBy,
    )
      .then(res => {
        setLoading(false);
        setTimeout(() => setToggleModalSuccess(true), 500);
        setFinishImg(null);
        setDefaultRating(0);
      })
      .catch(err => {
        console.log(err);
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
  };

  const closeFinishModal = () => {
    setToggleModalUpload(false);
    setFinishImg(null);
  };

  const onChangImgFinish = () => {
    setToggleModalUpload(false);
    setTimeout(() => setToggleModalReview(true), 500);
  };
  const onCloseSuccessModal = () => {
    setToggleModalSuccess(false);
    setTimeout(
      () =>
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: idUpload},
        }),
      500,
    );
  };
  return (
    <>
      {data.length !== 0 && checkResIsComplete ? (
        <View style={[{flex: 1, backgroundColor: colors.grayBg, padding: 8}]}>
          <FlatList
            keyExtractor={element => element.item.taskNo}
            data={data}
            extraData={data}
            renderItem={({item}: any) => (
              <Tasklists
                {...item.item}
                id={item.item.taskNo}
                status={item.item.status}
                title={item.item.farmerPlot.plantName}
                price={parseInt(item.item.price)+parseInt(item.item.revenuePromotion)}
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
                toggleModalUpload={toggleModalUpload}
                imgUploaded={imgUploaded}
                finishImg={finishImg}
                onAddImage={onAddImage}
                closeFinishModal={closeFinishModal}
                onChangImgFinish={onChangImgFinish}
                toggleModalReview={toggleModalReview}
                setComment={setComment}
                comment={comment}
                toggleModalSuccess={toggleModalSuccess}
                setToggleModalSuccess={setToggleModalSuccess}
                onFinishTask={onFinishTask}
                setToggleModalUpload={() =>
                  openModalUpload(
                    item.item.id,
                    `${item.item.droner.firstname} ${item.item.droner.lastname}`,
                  )
                }
                onCloseSuccessModal={onCloseSuccessModal}
              />
            )}
          />
          <View />
        </View>
      ) : (
        <>
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
                    โปรดติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข โทร. {callcenterNumber}
                  </Text>
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
