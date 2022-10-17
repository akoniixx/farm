import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import {normalize} from '../../function/Normalize';
import icons from '../../assets/icons/icons';
import {numberWithCommas} from '../../function/utility';
import {font} from '../../assets';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {useFocusEffect} from '@react-navigation/native';

interface Props {
  totalRevenueToday?: number;
  totalTask?: number;
  totalArea?: number;
  totalRevenue?: number;
  styleContainer?: ViewStyle;
}
interface State {
  totalRevenueToday: number;
  totalTask: number;
  totalArea: number;
  totalRevenue: number;
}
const CardIncomeList = ({styleContainer}: Props): JSX.Element => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<State>({
    totalRevenueToday: 0,
    totalTask: 0,
    totalArea: 0,
    totalRevenue: 0,
  });
  const {totalRevenueToday, totalTask, totalArea, totalRevenue} = data;
  const getProfileById = async () => {
    try {
      const result = await ProfileDatasource.getTaskrevenuedroner();
      setData(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getProfileById();
    }, []),
  );

  const dataCard = [
    {
      title: 'รายได้วันนี้',
      value: numberWithCommas(totalRevenueToday.toString()) || 0,
      icons: icons.income,
      unitPostion: 'front',
      unit: '฿',
      backgroundColor: colors.orange,
    },
    {
      title: 'รายได้ทั้งหมด',
      value: numberWithCommas(totalRevenue.toString()) || 0,
      icons: icons.income,
      unitPostion: 'front',
      unit: '฿',
      backgroundColor: '#6B7580',
    },
    {
      title: 'ไร่สะสม',
      value: totalArea || 0,
      icons: icons.farm,
      unitPostion: 'back',
      unit: 'ไร่',
      backgroundColor: '#37ABFF',
    },
    {
      title: 'งานที่บินเสร็จ',
      value: totalTask || 0,
      icons: icons.dronejob,
      unitPostion: 'back',
      unit: 'งาน',
      backgroundColor: '#3EBD93',
    },
  ];
  return loading ? (
    <ActivityIndicator size={'large'} />
  ) : (
    <FlatList
      data={dataCard}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={{
        paddingHorizontal: 8,
        ...styleContainer,
      }}
      renderItem={({item, index}) => {
        return (
          <View
            key={index}
            style={{
              backgroundColor: item.backgroundColor,
              marginHorizontal: 5,
              paddingHorizontal: 10,
              paddingVertical: normalize(10),
              justifyContent: 'space-between',
              width: '48%',
              marginBottom: 8,
              height: 85,
              borderRadius: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image source={item.icons} style={styles.iconsTask} />
              <Text style={styles.font}>{item.title}</Text>
            </View>
            <Text style={styles.font}>
              {item.unitPostion === 'front' && (
                <Text style={styles.fontValue}>{item.unit}</Text>
              )}
              <Text style={[styles.fontValue]}>{item.value}</Text>
              {item.unitPostion === 'back' && (
                <Text style={styles.font}>{` ${item.unit}`}</Text>
              )}
            </Text>
          </View>
        );
      }}
    />
  );
};
export default CardIncomeList;

const styles = StyleSheet.create({
  font: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.white,
  },
  fontValue: {
    fontFamily: font.bold,
    fontSize: normalize(20),
    color: colors.white,
  },
  iconsTask: {
    width: normalize(20),
    height: normalize(20),
    marginRight: normalize(5),
  },
});
