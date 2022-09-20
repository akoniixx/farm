import { normalize } from "@rneui/themed";
import React, { useEffect, useState } from "react"
import {  FlatList, Image, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, image } from "../../assets";
import MainTasklist from "../../components/TaskList/MainTasklist";
import { TaskDatasource } from "../../datasource/TaskDatasource";
import { stylesCentral } from "../../styles/StylesCentral";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
const InprogressTask:React.FC = () =>{
    const [data, setData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [checkResIsComplete, setCheckResIsComplete] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
          getData();
        }, []),
      );
    const getData = async () => {
        setLoading(false);
        const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
        TaskDatasource.getTaskById(
          droner_id,
          ['IN_PROGRESS'],
          page,
          4,
        )
          .then(res => {
            if (res !== undefined) {
              setData(data.concat(res));
              setCheckResIsComplete(true);
            }
          })
          .catch(err => console.log(err));
      };
      useEffect(() => {
        getData();
      }, [loading, page]);
    return data.length !== 0 && checkResIsComplete ?(
        <View style={[{flex: 1, backgroundColor: colors.grayBg, padding: 8}]}>
        <FlatList
          onEndReached={() => {
            setLoading(true);
            setPage(page + 1);
          }}
          keyExtractor={element => element.item.taskNo}
          data={data}
          extraData={data}
          renderItem={({item}: any) => (
            <MainTasklist
              id={item.item.taskNo}
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
              taskId={item.item.id}
              farmArea={item.item.farmAreaAmount}
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
        <Text style={stylesCentral.blankFont}>ยังไม่มีงานที่เริ่มดำเนินการ</Text>
      </View>
    )
}
export default InprogressTask