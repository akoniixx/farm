import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../assets';
import fonts from '../../assets/fonts';
import CardIncomeList from '../../components/CardIncomeList/CardIncomeList';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {normalize} from '../../function/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';
import ContentList from './ContentList';
import CustomHeader from '../../components/CustomHeader';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import Text from '../../components/Text';

export interface DataType {
  price: any;
  revenuePromotion: any;
  taskNo: string;
  discount: string;
  farmAreaAmount: string;
  dateAppointment: string;
  targetSpray: string[];
  totalPrice: string;
  farmerPlot: {plantName: string};
  purposeSpray: {
    purposeSprayName: string;
  };
}
export interface State {
  totalRevenueToday: number;
  totalTask: number;
  totalArea: number;
  totalRevenue: number;
}

const IncomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [type, setType] = React.useState<string>('week');
  const [data, setData] = useState<DataType[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataHeader, setDataHeader] = React.useState<State>({
    totalRevenueToday: 0,
    totalTask: 0,
    totalArea: 0,
    totalRevenue: 0,
  });
  const [refreshing, setRefreshing] = React.useState(false);
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
    try {
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

      setDataHeader(result.summary);
      setTotal(result.count);
      setData(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataTask();
    setRefreshing(false);
  };
  return (
    <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
      <CustomHeader
        showBackBtn={true}
        onPressBack={() => {
          navigation.goBack();
        }}
        title={
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: normalize(19),
              color: colors.fontBlack,
            }}>
            รายได้
          </Text>
        }
      />
      <NetworkLost onPress={onRefresh}>
        <View>
          <CardIncomeList data={dataHeader} />
        </View>
        <ContentList
          type={type}
          setType={setType}
          page={page}
          setPage={setPage}
          data={data}
          setData={setData}
          total={total}
        />
      </NetworkLost>

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </View>
  );
};
export default IncomeScreen;
