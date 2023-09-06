import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { normalize } from '@rneui/themed';
import { useIsFocused } from '@react-navigation/native';
import { MyCouponCardEntities } from '../../entites/CouponCard';
import { getMyCoupon } from '../../datasource/PromotionDatasource';
import { colors, font, image } from '../../assets';
import CouponCard from '../../components/CouponCard/CouponCard';
import { MainButton } from '../../components/Button/MainButton';
import * as RootNavigation from '../../navigations/RootNavigation';
import SelectDronerCouponModal from '../../components/Modal/SelectDronerCoupon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import VerifyStatus from '../../components/Modal/VerifyStatus';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';

const MyCouponExpiredScreen: React.FC<any> = ({ navigation, route }) => {
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<any[]>([]);

  const [modal, setModal] = useState<boolean>(false);
  const [modalVerify, setModalVerify] = useState<boolean>(false);
  const [status, setStatus] = useState();
  const getData = (page: number, take: number) => {
    getMyCoupon(page, take).then(res => {
      setCount(res.count);
      setData(res.data);
    });
  };
  useEffect(() => {
    getData(page, 5);
    getProfile();
  }, []);
  const onScrollEnd = () => {
    let pageNow = page;
    if (data.length < count) {
      getMyCoupon(pageNow + 1, 5, false).then(res => {
        let newData = data.concat(res.data);
        setPage(pageNow + 1);
        setData(newData);
      });
    }
  };
  const getProfile = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      ProfileDatasource.getProfile(farmer_id!)
        .then(async res => {
          setStatus(res.status);
        })
        .catch(err => console.log(err));
    }
  };
  return (
    <View
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: colors.bgGreen,
      }}>
      <SelectDronerCouponModal
        show={modal}
        onClose={() => setModal(false)}
        onMainClick={() => {
          RootNavigation.navigate('DronerUsedScreen', {
            isSelectDroner: true,
            profile: {},
          });
          setModal(false);
        }}
        onBottomClick={() => {
          RootNavigation.navigate('SelectDateScreen', {
            isSelectDroner: false,
            profile: {},
          });
          setModal(false);
        }}
      />
      {data.length != 0 ? (
        <View
          style={{
            padding: normalize(17),
          }}>
          <FlatList
            onScrollEndDrag={onScrollEnd}
            data={data}
            ListFooterComponent={<View style={{ height: normalize(250) }} />}
            renderItem={({ item }) => {
              return (
                <CouponCard
                  id={item.promotion.id}
                  couponCode={
                    item.promotion.promotionType === 'ONLINE'
                      ? item.promotion.couponCode
                      : item.offlineCode
                  }
                  couponName={item.promotion.couponName}
                  couponType={item.promotion.couponType}
                  promotionType={item.promotion.promotionType}
                  promotionStatus={item.promotion.promotionStatus}
                  discountType={item.promotion.discountType}
                  discount={item.promotion.discount}
                  count={item.promotion.count}
                  keep={item.promotion.keep}
                  used={item.promotion.used}
                  startDate={item.promotion.startDate}
                  expiredDate={item.promotion.expiredDate}
                  description={item.promotion.description}
                  condition={item.promotion.condition}
                  conditionSpecificFarmer={
                    item.promotion.conditionSpecificFarmer
                  }
                  couponConditionRai={item.promotion.couponConditionRai}
                  couponConditionRaiMin={item.promotion.couponConditionRaiMin}
                  couponConditionRaiMax={item.promotion.couponConditionRaiMax}
                  couponConditionService={item.promotion.couponConditionService}
                  couponConditionServiceMin={
                    item.promotion.couponConditionServiceMin
                  }
                  couponConditionServiceMax={
                    item.promotion.couponConditionServiceMax
                  }
                  couponConditionPlant={item.promotion.couponConditionPlant}
                  couponConditionPlantList={
                    item.promotion.couponConditionPlantList
                  }
                  couponConditionProvince={
                    item.promotion.couponConditionProvince
                  }
                  couponConditionProvinceList={
                    item.promotion.couponConditionProvinceList
                  }
                  keepthis={false}
                  disabled={true}
                  expired={true}
                />
              );
            }}
            keyExtractor={item => item.promotion.id}
          />
        </View>
      ) : (
        <View style={styles.empty}>
          <Image
            source={image.empty_coupon}
            style={{ width: 130, height: 122 }}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Text style={styles.textEmpty}>ไม่มีคูปองเก็บสะสม</Text>
            <Text style={styles.textEmpty}>ติดตามคูปองและสิทธิพิเศษมากมาย</Text>
            <Text style={styles.textEmpty}>ได้ที่หน้าโปรโมชั่น เร็วๆนี้ </Text>
          </View>
        </View>
      )}
      <View
        style={{
          width: Dimensions.get('screen').width,
          position: 'absolute',
          bottom: 0,
          padding: normalize(17),
          backgroundColor: colors.white,
        }}>
        <MainButton
          label="จ้างนักบินโดรน"
          color={colors.greenLight}
          onPress={() =>
            status !== 'ACTIVE' ? setModalVerify(true) : setModal(true)
          }
        />
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVerify}>
        <VerifyStatus
          text={status}
          show={modalVerify}
          onClose={() => {
            mixpanel.track(
              'MyCouponUsedScreen_ModalVerifyStatusOnClose_tapped',
            );
            setModalVerify(false);
          }}
          onMainClick={() => {
            mixpanel.track(
              'MyCouponUsedScreen_ModalVerifyStatusOnMainClick_tapped',
            );
            setModalVerify(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default MyCouponExpiredScreen;

const styles = StyleSheet.create({
  main: {
    padding: normalize(17),
  },
  empty: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    paddingVertical: '50%',
    backgroundColor: colors.bgGreen,
    height: '100%',
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    paddingVertical: 2,
    color: colors.gray,
    alignItems: 'center',
  },
});
