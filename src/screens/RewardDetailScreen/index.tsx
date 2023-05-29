/* eslint-disable @typescript-eslint/no-shadow */
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {colors, font, icons} from '../../assets';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import CustomHeader from '../../components/CustomHeader';
import {momentExtend, numberWithCommas} from '../../function/utility';
import mockImage from '../../assets/mockImage';
import Counter from '../../components/Counter/Counter';
import {normalize} from '../../function/Normalize';
import Modal from '../../components/Modal/Modal';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import {RewardListType} from '../RewardScreen/ListReward';
import {usePoint} from '../../contexts/PointContext';
import HTML from 'react-native-render-html';

import moment from 'moment';
import {useAuth} from '../../contexts/AuthContext';
import FastImage from 'react-native-fast-image';
interface Props {
  navigation: StackNavigationHelpers;
  route: RouteProp<StackParamList, 'RewardDetailScreen'>;
}
export default function RewardDetailScreen({navigation, route}: Props) {
  const {isDigital, id} = route.params;

  const width = useWindowDimensions().width - 32;
  const [counter, setCounter] = React.useState(1);
  const {currentPoint} = usePoint();
  const [isConfirm, setIsConfirm] = React.useState(false);
  const [showSuccessExchangeModal, setShowSuccessExchangeModal] =
    React.useState(false);
  const [rewardDetail, setRewardDetail] = React.useState<RewardListType>(
    {} as RewardListType,
  );
  const requirePoint = useMemo(() => {
    if (!rewardDetail.score) {
      return 0;
    }
    return +rewardDetail.score;
  }, [rewardDetail]);
  useEffect(() => {
    const getRewardById = async () => {
      try {
        const result = await rewardDatasource.getRewardDetail(id);
        const resultData: RewardListType = {
          ...result,
        };
        if (resultData.score && +resultData.score > currentPoint) {
          setCounter(0);
        }
        setRewardDetail(resultData);
      } catch (e) {
        console.log(e);
      }
    };
    if (id) {
      getRewardById();
    }
  }, [id, currentPoint]);
  const onPressExchange = () => {
    navigation.navigate('ExchangeAddressScreen', {
      data: {
        ...rewardDetail,
        amountExchange: counter,
        usePoint: requirePoint * counter,
      },
    });
  };

  const {isLimit, isDisableMinus, isDisablePlus, disableButton} =
    useMemo(() => {
      const isDisableMinus = counter <= 1;

      const disableButton =
        counter <= 0 || counter * requirePoint > currentPoint;
      const isDisablePlus = (counter + 1) * requirePoint >= currentPoint;

      return {
        isLimit: (counter || 1) * requirePoint >= currentPoint,
        isDisableMinus,
        isDisablePlus,
        disableButton,
      };
    }, [counter, currentPoint, requirePoint]);
  console.log('rewardDetail', JSON.stringify(rewardDetail, null, 2));
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() => navigation.goBack()}
        headerCenter={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Image
              source={icons.ICKDronerPoint}
              style={{
                width: 30,
                height: 30,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(20),
                color: colors.fontBlack,
                textAlign: 'center',
              }}>
              {numberWithCommas(currentPoint.toString(), true)} แต้ม
            </Text>
          </View>
        }
      />
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <FastImage
            source={{
              uri: rewardDetail.imagePath,
            }}
            style={{
              height: width,
              width: width,
              borderRadius: 12,
            }}
          />
        </View>
        <View style={styles({disable: disableButton}).container}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: font.bold,
              lineHeight: 40,
              width: '80%',
            }}>
            {rewardDetail.rewardName || ''}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 20,
                marginTop: 8,
                fontFamily: font.medium,
              }}>
              ใช้แต้ม {numberWithCommas(requirePoint.toString(), true)} แต้ม
            </Text>
            {!isDigital && (
              <Counter
                count={counter}
                isDisableMinus={isDisableMinus}
                isDisablePlus={isDisablePlus}
                setCount={count => setCounter(count)}
                isLimit={isLimit}
              />
            )}
          </View>
          {/* <View style={styles({disable: disableButton}).amountContainer}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.darkOrange,
              }}>
              จำนวนคงเหลือ
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              {amount}
            </Text>
          </View> */}
          {isDigital && rewardDetail?.expiredExchangeDate && (
            <View
              style={{
                borderRadius: 10,
                padding: 10,
                minHeight: 62,
                marginTop: 16,
                backgroundColor: colors.skySoft,
                width: 162,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.medium,
                  color: colors.skyDark,
                }}>
                หมดอายุอีก{' '}
                {moment(rewardDetail.expiredUsedDate).diff(moment(), 'days')}{' '}
                วัน
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  color: colors.fontBlack,
                }}>
                {momentExtend.toBuddhistYear(
                  rewardDetail?.expiredUsedDate?.toString() || '',
                  'DD MMM YYYY',
                )}
              </Text>
            </View>
          )}
          <View
            style={{
              marginTop: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              รายละเอียด
            </Text>
            <HTML
              source={{
                html: rewardDetail.description || '',
              }}
              contentWidth={width}
              tagsStyles={{
                p: {
                  fontSize: 16,
                  fontFamily: font.light,
                  color: colors.gray,
                  lineHeight: 28,
                },
              }}
            />
          </View>
          <View
            style={{
              marginTop: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              เงื่อนไข
            </Text>
            <HTML
              source={{
                html: rewardDetail.condition || '',
              }}
              contentWidth={width}
              tagsStyles={{
                p: {
                  fontSize: 16,
                  fontFamily: font.light,
                  color: colors.gray,
                  lineHeight: 28,
                },
              }}
            />
          </View>

          <View
            style={{
              height: 40,
            }}
          />
        </View>
      </ScrollView>
      <View style={styles({disable: disableButton}).footer}>
        <TouchableOpacity
          disabled={disableButton}
          style={styles({disable: disableButton}).button}
          onPress={isDigital ? () => setIsConfirm(true) : onPressExchange}>
          <Text style={styles({disable: disableButton}).textButton}>
            แลกแต้ม
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isConfirm}
        onPressPrimary={() => {
          setIsConfirm(false);
          setShowSuccessExchangeModal(true);
        }}
        title={'ยืนยันการแลกแต้ม'}
        onPressSecondary={() => setIsConfirm(false)}
        subTitle={'ท่านต้องการยืนยันการแลกแต้มหรือไม่'}
      />
      <Modal
        showClose
        onClose={() => setShowSuccessExchangeModal(false)}
        iconTop={
          <Image
            source={icons.successIcon}
            style={{width: 42, height: 42, marginBottom: 16}}
          />
        }
        visible={showSuccessExchangeModal}
        onPressPrimary={() => {
          setShowSuccessExchangeModal(false);
          navigation.navigate('RedeemScreen', {
            data: {
              image: mockImage.reward1,
            },
          });
        }}
        onPressSecondary={() => {
          setShowSuccessExchangeModal(false);
          navigation.navigate('MyRewardScreen');
        }}
        title={'แลกแต้มสำเร็จ'}
        subTitle={'คูปองพร้อมใช้งานแล้ว'}
        titlePrimary="ใช้คูปองทันที"
        titleSecondary="ยังไม่ใช้ ดูรีวอร์ดของฉัน >"
      />
    </SafeAreaView>
  );
}

const styles = ({disable}: {disable?: boolean}) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    amountContainer: {
      paddingVertical: 8,
      paddingLeft: 16,
      paddingRight: 40,
      backgroundColor: colors.orangeSoft,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    footer: {
      height: 100,
      backgroundColor: colors.white,

      flexDirection: 'row',
      padding: 16,
      elevation: 8,
      shadowColor: '#242D35',
      shadowOffset: {
        width: 0,
        height: -8,
      },
      shadowOpacity: 0.04,
      shadowRadius: 16,
    },
    textButton: {
      fontSize: 18,
      fontFamily: font.bold,
      color: colors.white,
    },
    button: {
      width: '100%',
      backgroundColor: disable ? colors.disable : colors.orange,
      borderRadius: 12,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: disable ? colors.disable : '#F86820',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    subButton: {
      width: '100%',
      backgroundColor: 'transparent',
      borderRadius: 12,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
  });
