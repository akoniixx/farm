import React,{ useCallback, useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from "react-native"
import { getAllHistoryPoint, getAllPendingPoint } from "../../datasource/HistoryPointDatasource";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, font, image } from "../../assets";
import { normalize } from "../../function/Normalize";
import { HistoryPoint } from "../../components/point/HistoryPoint";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { PendingPoint } from "../../components/point/PendingPoint";

const PendingPointScreen: React.FC<any> = ({ navigation, route }) => {
    const [dataAllPoint, setDataAllPoint] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [row, setRow] = useState(10);
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        getPendingPoint()
    }, [current, row]);
   

const getPendingPoint =async () => {
    setLoading(true)
    const droner_id: any = await AsyncStorage.getItem('droner_id');
    await getAllPendingPoint(droner_id)
    .then(res => {
      setDataAllPoint(res)
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
}

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getPendingPoint()
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    const loadMoreData = async () => {
        setCurrent(current + 1);
        setRow(row + 10);
        const droner_id: any = await AsyncStorage.getItem('droner_id');
        await getAllHistoryPoint(droner_id, current, row)
            .then(res => {
                if (res.history != 0) {
                    setDataAllPoint((data: any) => {
                        return data.concat(dataAllPoint);
                    });
                } else {
                    return setCurrent(current);
                }
            })
            .catch(err => console.log(err));
    };
    return (
        <View>
            <View style={{alignItems:'center',paddingVertical:normalize(10)}}>
                <Text style={{fontFamily:font.medium,fontSize:normalize(12),color:colors.fontGrey}}>แต้มโดยประมาณที่ท่านจะได้รับหลังจากเกษตรกรรีวิวงานเสร็จ</Text>
            </View>
 {dataAllPoint ? (
                <View
                    style={{
                        backgroundColor: colors.white,
                    }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        onEndReached={loadMoreData}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={<View style={{ height: normalize(450) }} />}
                        data={dataAllPoint}
                        renderItem={({ item, index }) => (
                            <PendingPoint
                                index={index}
                                date={item.createAt}
                                point={item.receivePoint}
                                action={item.campaignName}
                                taskId={item.taskId}
                                taskNo={item.task.taskNo}
                            />
                        )}
                    />
                </View>
            ) : (
                <View
                    style={{
                        alignSelf: 'center',
                        paddingVertical: normalize(150),
                        height: '100%',
                    }}>
                    <Image
                        source={image.pointEmpty}
                        style={{ width: normalize(130), height: normalize(120) }}
                    />
                    <View style={{ top: normalize(20) }}>
                        <Text style={styles.textEmpty}>ไม่มีคะแนนที่ได้รับ</Text>
                        <Text style={styles.textEmpty}>และการที่ใช้คะแนน</Text>
                    </View>
                </View>
            )}
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
            />
        </View>
    )
}
export default PendingPointScreen

const styles = StyleSheet.create({
    inner: {
        marginTop: normalize(50),
        paddingHorizontal: normalize(17),
    },
    container: {
        flex: 1,
    },
    HeadBg: {
        width: '100%',
        height: normalize(140),
        backgroundColor: colors.green,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        display: 'flex',
        paddingVertical: '50%',
    },
    textEmpty: {
        fontFamily: font.light,
        fontSize: normalize(18),
        lineHeight: normalize(30),
        textAlign: 'center',
        color: colors.fontGrey,
    },
});