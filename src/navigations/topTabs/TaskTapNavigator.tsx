import { normalize } from "@rneui/themed";
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { useState } from 'react';
import { View, useWindowDimensions, Text, StyleSheet, Image } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import fonts from "../../assets/fonts";
// import font from "../../../android/app/build/intermediates/assets/debug/mergeDebugAssets/fonts/font";
import { colors, image } from '../../assets';
import NewTaskScreen from "../../screens/MainScreen/NewTaskScreen";
import TaskScreen from "../../screens/MainScreen/TaskScreen";
import { TaskDatasource } from "../../datasource/TaskDatasource";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import Tasklist from "../../components/TaskList/Tasklist";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CallingModal } from "../../components/Modal/CallingModal";
import { stylesCentral } from "../../styles/StylesCentral";
import Toast from "react-native-toast-message";

const renderTabBar = (props:any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor:colors.orange }}
    style={{ backgroundColor: colors.white }}
    renderLabel={({ route, focused, color }) => (
      <Text style={[styles.label,{color: focused ? colors.orange : colors.gray }]}>
        {route.title}
      </Text>
    )}
  />
);

const TaskTapNavigator:any =()=> {
  const layout = useWindowDimensions();
  const [telNum, setTelNum] = useState<string>('');

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'task', title: 'งานที่ต้องทำ' },
    { key: 'newTask', title: 'งานใหม่สำหรับคุณ' },
  ]);
    // variables
    const snapPoints = useMemo(() => ['25%', '25%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);

    const updateTask = (id:string,dronerId:string,status: string) => {
      if (status === 'WAIT_START') {
        TaskDatasource.updateTaskStatus(id, dronerId, 'IN_PROGRESS')
          .then(res => {
            Toast.show({
              type: 'success',
              text1: `งาน ${data.taskNo}`,
              text2: 'อัพเดทสถานะเรียบร้อยแล้ว',
            });
            getData();
          })
          .catch(err => console.log(err.response.data));
      }
    };

  const renderScene = SceneMap({
    task: ()=> (data.length !== 0 && checkResIsComplete ? (
      <View style={[{flex: 1, backgroundColor: colors.grayBg, padding: 8}]}>
        <FlatList
          onEndReached={() => {
            setLoading(true);
            setPage(page + 1);
          }}
          keyExtractor={element => element.item.id}
          data={data}
          renderItem={({item}: any) => (
            <Tasklist
              id={item.item.taskNo}
              status={item.item.status}
              title={item.item.farmerPlot.plantName}
              price={item.item.totalPrice}
              date={item.item.dateAppointment}
              address={item.item.farmerPlot.landmark}
              distance={item.item.distance}
              user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
              img={item.image_profile_url}
              preparation={item.item.preparationBy}
              tel={item.item.farmer.telephoneNo}
              callFunc={handlePresentModalPress}
              setTel={setTelNum}
              taskId={item.item.id}
              updateTask={()=>updateTask(item.item.id,item.item.dronerId,item.item.status)}
            />
          )}
        />
        <View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}>
            <CallingModal tel={telNum} />
          </BottomSheetModal>
        </View>
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
    )
    ),
    newTask: NewTaskScreen,
  });

  const getData = async () => {
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(
      droner_id,
      ['WAIT_START', 'IN_PROGRESS'],
      page,
      4,
    )
      .then(res => {
        if (res !== undefined) {
          console.log("hello");
          setData(data.concat(res))
          setCheckResIsComplete(true);
        }
      })
      .catch(err => console.log(err));
  };
  useEffect(()=>{
    if(index == 0){
        setData([])
        setPage(1)
        getData()
    }
    else{
      console.log(1)
    } 
  },[index])

  useEffect(() => {
    getData();
  }, [loading, page]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

export default TaskTapNavigator

const styles = StyleSheet.create({
  label:{
    fontFamily:fonts.bold,
    fontSize:normalize(16)
  }
});