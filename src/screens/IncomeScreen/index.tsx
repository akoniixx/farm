import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
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
    fetchDataTask();
  }, [type]);
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
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </View>
  );
};
export default IncomeScreen;
