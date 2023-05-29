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
import {numberWithCommas} from '../../function/utility';
import mockImage from '../../assets/mockImage';
import Counter from '../../components/Counter/Counter';
import {normalize} from '../../function/Normalize';
import Modal from '../../components/Modal/Modal';
interface Props {
  navigation: StackNavigationHelpers;
  route: RouteProp<StackParamList, 'RewardDetailScreen'>;
}
export default function RewardDetailScreen({navigation, route}: Props) {
  const {isDigital = true} = route.params;
  const currentPoint = 6000;
  const width = useWindowDimensions().width - 32;
  const requirePoint = 2000;
  const [counter, setCounter] = React.useState(1);
  const [isConfirm, setIsConfirm] = React.useState(false);
  const [showSuccessExchangeModal, setShowSuccessExchangeModal] =
    React.useState(false);

  useEffect(() => {
    if (requirePoint > currentPoint) {
      setCounter(0);
    }
  }, []);
  const onPressExchange = () => {
    navigation.navigate('ExchangeAddressScreen', {
      data: {
        id: route.params.id,
        title: 'เสื้อไอคอนเกษตกร 2 ตัว มูลค่า 1,000 บาท',
        amount: counter,
        usePoint: requirePoint * counter,
        image: mockImage.reward1,
        pointLeft: currentPoint - requirePoint * counter,
      },
    });
  };

  const {isLimit, isDisableMinus, isDisablePlus, disableButton} =
    useMemo(() => {
      const isDisableMinus = counter <= 1;

      const disableButton =
        counter <= 0 || counter * requirePoint > currentPoint;
      const isDisablePlus = counter * requirePoint > currentPoint;
      return {
        isLimit: (counter || 1) * requirePoint >= currentPoint,
        isDisableMinus,
        isDisablePlus,
        disableButton,
      };
    }, [counter, currentPoint, requirePoint]);
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
          <Image
            source={mockImage.reward1}
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
            เสื้อไอคอนเกษตกร 2 ตัว มูลค่า 1,000 บาท
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
          {isDigital && (
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
                หมดอายุอีก 120 วัน
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  color: colors.fontBlack,
                }}>
                30 ต.ค. 66
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
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,
                color: colors.gray,
                lineHeight: 28,
              }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
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
            {[1, 2, 3, 4, 5].map((item, index) => {
              return (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.light,
                    color: colors.gray,
                    lineHeight: 28,
                  }}>
                  {`\u2022`} Lorem Ipsum is simply dummy text of the printing
                  and typesetting industry. Lorem Ipsum has been the industry's
                  standard
                </Text>
              );
            })}
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
