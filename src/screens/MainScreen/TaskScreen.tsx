import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {normalize} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import {colors, image, icons} from '../../assets';
import fonts from '../../assets/fonts';

import Tasklists from '../../components/TaskList/Tasklists';
import {TaskDatasource} from '../../datasource/TaskDatasource';

import {stylesCentral} from '../../styles/StylesCentral';
import * as ImagePicker from 'react-native-image-picker';

const TaskScreen: React.FC = () => {
  const [data, setData] = useState<any>([]);

  const [loading, setLoading] = useState(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);
  const [showModalStartTask, setShowModalStartTask] = useState<boolean>(false);

  const [togleModalUpload, setTogleModalUpload] = useState<boolean>(false);
  const [togleModalReview, setTogleModalReview] = useState<boolean>(false);
  const [togleModalSuccess, setTogleModalSuccess] = useState<boolean>(false);
  const [imgUploaded, setImgUploaded] = useState<boolean>(false);
  const [finishImg, setFinishImg] = useState<any>(null);
  const [defaulRating, setDefaulRating] = useState<number>(0);
  const [maxRatting, setMaxRatting] = useState<Array<number>>([1, 2, 3, 4, 5]);
  const [comment, setComment] = useState<string>('');
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

  const updateTask = (
    id: string,
    dronerId: string,
    status: string,
    taskNo: string,
  ) => {
    if (status === 'WAIT_START') {
      setLoading(true);
      setShowModalStartTask(false);
      TaskDatasource.updateTaskStatus(id, dronerId, 'IN_PROGRESS')
        .then(res => {
          Toast.show({
            type: 'success',
            text1: `งาน ${taskNo}`,
            text2: 'อัพเดทสถานะเรียบร้อยแล้ว',
          });
          setLoading(false);
          setTimeout(() => getData(), 500);
        })
        .catch(err => console.log(err.response.data));
    } else {
      console.log(status);
    }
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
  const onFinishTask = (id: string) => {
    setTogleModalReview(false);
    setTimeout(() => setLoading(true), 500);
    TaskDatasource.finishTask(finishImg, id, defaulRating, comment).then(
      res => {
        setLoading(false);
        console.log(res);
        setTimeout(() => setTogleModalSuccess(true), 500);
      },
    );
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
      .catch(err => console.log(err));
  };

  const closeFinishModal = () => {
    setTogleModalUpload(false);
    setFinishImg(null);
  };

  const onChangImgFinish = () => {
    setTogleModalUpload(false);
    setTimeout(() => setTogleModalReview(true), 500);
  };
  const onCloseSuccessModal = () => {
    setTogleModalSuccess(false);
    setTimeout(() => getData(), 500);
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
                id={item.item.taskNo}
                status={item.item.status}
                title={item.item.farmerPlot.plantName}
                price={item.item.totalPrice}
                date={item.item.dateAppointment}
                address={item.item.farmerPlot.locationName}
                distance={item.item.distance}
                user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                img={item.image_profile_url}
                preparation={item.item.comment}
                tel={item.item.farmer.telephoneNo}
                taskId={item.item.id}
                farmArea={item.item.farmAreaAmount}
                updateTask={() =>
                  updateTask(
                    item.item.id,
                    item.item.dronerId,
                    item.item.status,
                    item.item.taskNo,
                  )
                }
                showModalStartTask={showModalStartTask}
                setShowModalStartTask={() =>
                  setShowModalStartTask(!showModalStartTask)
                }
                maxRatting={maxRatting}
                setDefaulRating={setDefaulRating}
                defaulRating={defaulRating}
                starImgFilled={starImgFilled}
                starImgCorner={starImgCorner}
                togleModalUpload={togleModalUpload}
                imgUploaded={imgUploaded}
                finishImg={finishImg}
                onAddImage={onAddImage}
                closeFinishModal={closeFinishModal}
                onChangImgFinish={onChangImgFinish}
                togleModalReview={togleModalReview}
                setComment={setComment}
                comment={comment}
                togleModalSuccess={togleModalSuccess}
                setTogleModalSuccess={setTogleModalSuccess}
                onFinishTask={() => onFinishTask(item.item.id)}
                setTogleModalUpload={setTogleModalUpload}
                onCloseSuccessModal={onCloseSuccessModal}
              />
            )}
          />
          <View></View>
        </View>
      ) : (
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
