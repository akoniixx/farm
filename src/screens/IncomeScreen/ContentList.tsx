import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  NativeScrollEvent,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import fonts from '../../assets/fonts';
import {normalize} from '../../function/Normalize';
import colors from '../../assets/colors/colors';
import dayjs from 'dayjs';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {numberWithCommas} from '../../function/utility';
import Divider from '../../components/Divider';

interface Styles {
  isFocus?: boolean;
}
interface DataType {
  taskNo: string;
  farmAreaAmount: string;
  dateAppointment: string;
  targetSpray: string[];
  totalPrice: string;
  farmerPlot: {plantName: string};
  purposeSpray: {
    purposeSprayName: string;
  };
}
export default function ContentList(): JSX.Element {
  const [type, setType] = React.useState<string>('week');
  const [data, setData] = useState<DataType[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const listHeader = [
    {
      title: 'สัปดาห์นี้',
      type: 'week',
    },
    {
      title: 'เดือนนี้',
      type: 'month',
    },
    {
      title: '3 เดือน',
      type: '3month',
    },
  ];
  useEffect(() => {
    const fetchDataTask = async () => {
      const currentStartOfWeek = dayjs().startOf('week').toISOString();
      const currentEndOfWeek = dayjs().endOf('week').toISOString();
      const currentStartOfMonth = dayjs().startOf('month').toISOString();
      const currentEndOfMonth = dayjs().endOf('month').toISOString();
      const currentStartOf3Month = dayjs()
        .subtract(3, 'month')
        .startOf('month')
        .toISOString();
      const currentEndOf3Month = dayjs().endOf('month').toISOString();
      const result = await ProfileDatasource.getListTaskInProgress({
        start:
          type === 'week'
            ? currentStartOfWeek
            : type === 'month'
            ? currentStartOfMonth
            : currentStartOf3Month,
        end:
          type === 'week'
            ? currentEndOfWeek
            : type === 'month'
            ? currentEndOfMonth
            : currentEndOf3Month,
      });
      setTotal(result.count);
      setData(result.data);
    };
    fetchDataTask();
  }, [type]);

  const onLoadMore = async () => {
    try {
      if (data.length < total) {
        const currentStartOfWeek = dayjs().startOf('week').toISOString();
        const currentEndOfWeek = dayjs().endOf('week').toISOString();
        const currentStartOfMonth = dayjs().startOf('month').toISOString();
        const currentEndOfMonth = dayjs().endOf('month').toISOString();
        const currentStartOf3Month = dayjs()
          .subtract(3, 'month')
          .startOf('month')
          .toISOString();
        const currentEndOf3Month = dayjs().endOf('month').toISOString();
        const result = await ProfileDatasource.getListTaskInProgress({
          start:
            type === 'week'
              ? currentStartOfWeek
              : type === 'month'
              ? currentStartOfMonth
              : currentStartOf3Month,
          end:
            type === 'week'
              ? currentEndOfWeek
              : type === 'month'
              ? currentEndOfMonth
              : currentEndOf3Month,
          page: page + 1,
        });
        setPage(prev => prev + 1);
        setData([...data, ...result.data]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <>
      <View style={styles({}).header}>
        {listHeader.map((item, index) => {
          const isFocus = item.type === type;

          return (
            <TouchableOpacity
              key={index}
              style={styles({isFocus}).buttonHeader}
              onPress={() => {
                setType(item.type);
                setPage(1);
              }}>
              <Text style={styles({isFocus}).textHeader}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {data.length > 0 ? (
        <ScrollView
          scrollEventThrottle={400}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              onLoadMore();
            }
          }}>
          {data.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  marginBottom: 16,
                  height: 120,
                  paddingHorizontal: 16,
                }}>
                <Text style={styles({}).textTitle}>
                  {dayjs(item.dateAppointment).format('DD/MM/BBBB')}
                </Text>

                <View style={{paddingVertical: 8}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={styles({}).text} numberOfLines={1}>
                      {`${item?.purposeSpray?.purposeSprayName} (${item?.farmerPlot?.plantName}) (${item?.farmAreaAmount} ไร่)`}
                    </Text>
                    <Text style={styles({}).textMoney}>
                      ฿{numberWithCommas(item.totalPrice, true)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles({}).textSmall,
                      {
                        marginTop: 4,
                      },
                    ]}>
                    {dayjs(item.dateAppointment).format('HH:mm')} น.
                  </Text>
                  <Divider />
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 32,
          }}>
          <Text style={styles({}).textTitle}>ไม่มีรายการ</Text>
        </View>
      )}
    </>
    // <FlatList
    //   data={data}
    //   stickyHeaderIndices={[0]}
    //   ListHeaderComponent={
    //     <View style={styles({}).header}>
    //       {listHeader.map((item, index) => {
    //         const isFocus = item.type === type;

    //         return (
    //           <TouchableOpacity
    //             key={index}
    //             style={styles({isFocus}).buttonHeader}
    //             onPress={() => setType(item.type)}>
    //             <Text style={styles({isFocus}).textHeader}>{item.title}</Text>
    //           </TouchableOpacity>
    //         );
    //       })}
    //     </View>
    //   }
    //   contentContainerStyle={{
    //     paddingHorizontal: 16,
    //   }}
    //   ListEmptyComponent={
    //     <View
    //       style={{
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         marginTop: 32,
    //       }}>
    //       <Text style={styles({}).textTitle}>ไม่มีรายการ</Text>
    //     </View>
    //   }

    //   keyExtractor={(item, index) => index.toString()}
    // />
  );
}

const styles = ({isFocus = false}: Styles) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 8,
      backgroundColor: colors.white,
    },
    buttonHeader: {
      paddingVertical: 8,
      paddingHorizontal: 32,

      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isFocus ? colors.orange : 'transparent',
    },
    textHeader: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: isFocus ? colors.white : colors.gray,
    },
    textTitle: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: colors.fontBlack,
    },
    text: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: colors.fontBlack,
    },
    textMoney: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: colors.greenDark,
    },
    textSmall: {
      fontFamily: fonts.light,
      fontSize: normalize(14),
      color: colors.gray,
    },
  });
