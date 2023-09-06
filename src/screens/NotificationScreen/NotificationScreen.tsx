import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { stylesCentral } from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import NotificationCard from '../../components/NotificationCard/NotificationCard';
import * as RootNavigation from '../../navigations/RootNavigation';
import { NotificationType } from '../../entites/NotificationCard';
import { FCMtokenDatasource } from '../../datasource/FCMDatasource';
import { FlatList } from 'react-native-gesture-handler';
import { colors, image } from '../../assets';
import { normalize } from '@rneui/themed';
import fonts from '../../assets/fonts';
import Text from '../../components/Text/Text';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ActivityIndicator } from 'react-native-paper';

const monthArray = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const generateNotiTime = (date: string) => {
  const datetimesplit = date.split('T');
  const datesplit = datetimesplit[0].split('-');
  return `${datesplit[2]} ${monthArray[parseInt(datesplit[1]) - 1]} ${
    (parseInt(datesplit[0]) + Number(543)) % 100
  }, ${parseInt(datetimesplit[1].split(':')[0]) + 7}:${
    datetimesplit[1].split(':')[1]
  }`;
};

function generateDataNotification(data: any[]) {
  return data.map((item: any) => {
    const type = item.type;
    switch (type) {
      case 'APPROVE_FARMER_SUCCESS':
        return {
          notificationType: NotificationType.VERIFY,
          expand: true,
          title: 'ยืนยันตัวตนสำเร็จ',
          isRead: item.isRead,
          subtitle: item.detail,
          dateString: generateNotiTime(item.createdAt),
          notiId: item.id,
        };
      case 'APPROVE_FARMER_FAIL':
        return {
          notificationType: NotificationType.VERIFY,
          expand: true,
          title: 'ยืนยันตัวตนไม่สำเร็จ',
          isRead: item.isRead,
          subtitle: item.detail,
          dateString: generateNotiTime(item.createdAt),
          notiId: item.id,
        };
      case 'APPROVE_FARMER_PLOT_SUCCESS':
        return {
          notificationType: NotificationType.VERIFY,
          expand: true,
          title: 'ยืนยันแปลงสำเร็จ',
          isRead: item.isRead,
          subtitle: item.detail,
          dateString: generateNotiTime(item.createdAt),
          notiId: item.id,
        };
      case 'APPROVE_FARMER_PLOT_FAIL':
        return {
          notificationType: NotificationType.VERIFY,
          expand: true,
          title: 'ยืนยันแปลงไม่สำเร็จ',
          isRead: item.isRead,
          subtitle: item.detail,
          dateString: generateNotiTime(item.createdAt),
          notiId: item.id,
        };
      default:
        return {
          notificationType: NotificationType.UNKNOWN,
          expand: true,
          title: 'ยืนยันแปลงไม่สำเร็จ',
          isRead: item.isRead,
          subtitle: item.detail,
          dateString: generateNotiTime(item.createdAt),
          notiId: item.id,
        };
    }
  });
}

const readIt = (notiId: string) => {
  FCMtokenDatasource.readNotification(notiId)
    .then(() =>
      RootNavigation.navigate('Main', {
        screen: 'ProfileScreen',
        params: { noti: true },
      }),
    )
    .catch(err => console.log(err));
};

const take = 10;
const initialPage = 1;

const NotificationScreen: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<{
    data: any[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const getNotificationData = async () => {
    setLoading(true);
    await FCMtokenDatasource.getNotificationList({
      page: initialPage,
      take,
    })
      .then(res => {
        setData({
          count: res.count,
          data: res.data,
        });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getNotificationData();
  }, []);

  const notiData = useMemo(() => {
    return generateDataNotification(data?.data || []).filter(
      (el: any) => el.notificationType !== NotificationType.UNKNOWN,
    );
  }, [data]);
  const onLoadMore = async () => {
    if (data.data.length < data.count) {
      setLoadingMore(true);
      await FCMtokenDatasource.getNotificationList({
        page: page + 1,
        take,
      })
        .then(res => {
          setData({
            count: res.count,
            data: [...data.data, ...res.data],
          });
          setPage(page + 1);
        })
        .catch(err => console.log(err))
        .finally(() => setLoadingMore(false));
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getNotificationData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="การแจ้งเตือน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      {loading ? (
        <View
          style={{
            marginTop: 32,
          }}>
          <SkeletonPlaceholder
            speed={2000}
            borderRadius={8}
            backgroundColor={colors.skeleton}>
            <>
              {[1, 2, 3, 4, 5, 6].map((_, idx) => {
                return (
                  <SkeletonPlaceholder.Item
                    key={idx}
                    style={{
                      paddingHorizontal: 16,
                      marginBottom: 16,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        height: normalize(100),
                      }}
                    />
                  </SkeletonPlaceholder.Item>
                );
              })}
            </>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <>
          {notiData.length !== 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={notiData}
              ListFooterComponent={
                loadingMore ? (
                  <View
                    style={{
                      marginTop: 16,
                    }}>
                    <ActivityIndicator
                      size={'large'}
                      color={colors.greenLight}
                    />
                  </View>
                ) : null
              }
              onEndReached={onLoadMore}
              renderItem={({ item }: any) => {
                return (
                  <NotificationCard
                    key={item.notiId}
                    expand={item?.expand}
                    title={item?.title}
                    notificationType={item?.notificationType}
                    isRead={item?.isRead}
                    subtitle={item?.subtitle}
                    dateString={item?.dateString}
                    onClick={() => {
                      readIt(item?.notiId);
                    }}
                  />
                );
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={image.emptyNoti}
                style={{ width: normalize(130), height: normalize(133) }}
              />
              <Text style={styles.text}>ไม่มีข้อความแจ้งเตือน</Text>
              <Text style={styles.text}>
                เมื่อคุณได้รับข้อความใหม่ กลับมาดูได้ที่นี่
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(18),
    color: '#8D96A0',
  },
});
