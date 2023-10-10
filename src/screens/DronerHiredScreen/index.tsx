import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import { TabBar, TabView } from 'react-native-tab-view';
import Text from '../../components/Text/Text';
import { colors } from '../../assets';
import { StyleSheet, useWindowDimensions } from 'react-native';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import { mixpanel } from '../../../mixpanel';
import Content from './Content';
import { DronerDatasource } from '../../datasource/DronerDatasource';
import { useAuth } from '../../contexts/AuthContext';
export interface DronerHired {
  droner_id: string;
  droner_code: string;
  nickname: string;
  firstname: string;
  lastname: string;
  telephone_no: string;
  subdistrict_name: string | null;
  district_name: string | null;
  province_name: string | null;
  is_open_receive_task: boolean;
  drone_brand: string;
  logo_drone_brand: string;
  count_drone: string;
  total_task: string | null;
  total_area: string | null;
  rating_avg: string;
  count_rating: string;
  last_review_avg: string | null;
  distance: number;
  task_image: string;
  image_droner: string | null;
  favorite_status: 'ACTIVE' | 'INACTIVE';
  date_appointment: string;
  street_distance: number;
  status_favorite: 'ACTIVE' | 'INACTIVE';
}

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#2EC46D' }}
    style={{
      backgroundColor: colors.white,
      paddingVertical: 8,
      height: normalize(60),
    }}
    renderLabel={({ route, focused }) => (
      <Text
        style={[
          styles.label,
          {
            color: focused ? '#1F8449' : colors.gray,
            lineHeight: 30,
            fontFamily: focused ? fonts.AnuphanSemiBold : fonts.AnuphanMedium,
          },
        ]}>
        {route.title}
      </Text>
    )}
  />
);
const initialPage = 1;
const limit = 6;

export const DronerHiredScreen: React.FC<
  StackScreenProps<MainStackParamList, 'DronerHiredScreen'>
> = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<{
    count: number;
    data: Array<DronerHired>;
  }>({
    count: 0,
    data: [],
  });
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useAuth();
  const layout = useWindowDimensions();
  const [routes] = useState([
    { key: 'all', title: 'ทั้งหมด' },
    { key: 'favorite', title: 'นักบินที่ถูกใจ' },
  ]);
  const getDronerHiredList = useCallback(async () => {
    if (routes[index].key === 'favorite') {
      try {
        setLoading(true);
        const payload = {
          limit,
          offset: 1,
          farmerId: user?.id || '',
          farmerPlotId: user?.farmerPlot[0].id || '',
          isNewResponse: true,
        };
        const res = await DronerDatasource.getMyFavoriteDroner(payload);
        setData({
          ...res,
          data: res.data.map((item: any) => {
            return {
              ...item,
              favorite_status: item.status_favorite,
            };
          }),
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const payload = {
          limit,
          offset: 1,
          farmerId: user?.id || '',
          farmerPlotId: user?.farmerPlot[0].id || '',
          isShowAll: true,
        };
        const res = await DronerDatasource.getDronerNearMeLogged(payload);

        setData(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setPage(1);
      }
    }
  }, [user?.farmerPlot, user?.id, index, routes]);

  const loadMore = useCallback(async () => {
    if (data.count <= data.data.length) {
      console.log('no more data');
      return;
    }

    try {
      const payload = {
        limit,
        offset: page + 1,
        farmerId: user?.id || '',
        farmerPlotId: user?.farmerPlot[0].id || '',
        isShowAll: true,
      };
      const res = await DronerDatasource.getDronerNearMeLogged(payload);
      setData(prev => {
        return {
          ...res,
          data: [...prev.data, ...res.data],
        };
      });
      setPage(prev => prev + 1);
    } catch (e) {
      console.log(e);
    }
  }, [page, data.count, user?.farmerPlot, user?.id, data.data.length]);

  const loadMoreFavorite = useCallback(async () => {
    if (data.count <= data.data.length) {
      console.log('no more data');
      return;
    }
    try {
      const payload = {
        limit,
        offset: page + 1,
        farmerId: user?.id || '',
        farmerPlotId: user?.farmerPlot[0].id || '',
        isNewResponse: true,
      };
      const res = await DronerDatasource.getMyFavoriteDroner(payload);
      setData(prev => {
        return {
          ...res,
          data: [
            ...prev.data,
            ...res.data.map((item: any) => {
              return {
                ...item,
                favorite_status: item.status_favorite,
              };
            }),
          ],
        };
      });
      setPage(prev => prev + 1);
    } catch (e) {
      console.log(e);
    }
  }, [page, user?.farmerPlot, user?.id, data.count, data.data.length]);
  const renderScene = useMemo(() => {
    return () => {
      return (
        <Content
          navigation={navigation}
          data={
            index === 1
              ? {
                  ...data,
                  data: data.data.filter((item: any) => {
                    return item.favorite_status === 'ACTIVE';
                  }),
                }
              : data
          }
          loading={loading}
          setData={setData}
          loadMore={index === 1 ? loadMoreFavorite : loadMore}
          getDronerHiredList={getDronerHiredList}
        />
      );
    };
  }, [
    data,
    loading,
    navigation,
    setData,
    getDronerHiredList,
    loadMore,
    index,
    loadMoreFavorite,
  ]);

  useEffect(() => {
    getDronerHiredList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="นักบินโดรนของฉัน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <TabView
        key={index}
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={idx => {
          mixpanel.track('DronerHiredScreen_TabViewOnIndexChange_tapped', {
            tab: routes[idx].title,
          });
          setIndex(idx);
          setPage(1);
        }}
        initialLayout={{ width: layout.width }}
        lazy
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(20),
  },
});
