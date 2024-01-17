import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import React, { useEffect, useMemo } from 'react';
import { colors, font, icons } from '../../assets';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import CustomHeader from '../../components/CustomHeader';
import { rewardDatasource } from '../../datasource/RewardDatasource';
import { usePoint } from '../../contexts/PointContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { mixpanel } from '../../../mixpanel';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import { DigitalRewardType, RewardListType } from '../../types/RewardType';
import { numberWithCommas } from '../../functions/utility';
import Text from '../../components/Text/Text';
import RenderHTML from 'react-native-render-html';
import { momentExtend } from '../../utils/moment-buddha-year';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShowCurrentPoint from '../../components/ShowCurrentPoint/ShowCurrentPoint';
import ModalCaseDigital from './ModalCaseDigital';
import ModalCasePhysical from './ModalCasePhysical';
interface Props {
  navigation: StackNavigationHelpers;
  route: RouteProp<MainStackParamList, 'RewardDetailScreen'>;
}

export default function RewardDetailScreen({ navigation, route }: Props) {
  const { isDigital, id } = route.params;
  const { getCurrentPoint } = usePoint();
  const {
    state: { user },
    authContext: { getProfileAuth },
  } = useAuth();

  const [resultRedeemDigital, setResultRedeemDigital] =
    React.useState<DigitalRewardType>({} as DigitalRewardType);

  const width = useWindowDimensions().width - 32;
  const [counter, setCounter] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const { currentPoint } = usePoint();
  const [isConfirm, setIsConfirm] = React.useState(false);
  const [showCounter, setShowCounter] = React.useState(false);
  const [showSuccessExchangeModal, setShowSuccessExchangeModal] =
    React.useState(false);
  const [rewardDetail, setRewardDetail] = React.useState<RewardListType>(
    {} as RewardListType,
  );

  const [disableExchange, setDisableExchange] = React.useState(false);
  const [cantExchange, setCantExchange] = React.useState(false);

  const requirePoint = useMemo(() => {
    if (!rewardDetail.score) {
      return 0;
    }
    return +rewardDetail.score;
  }, [rewardDetail]);
  const getRewardById = async () => {
    try {
      const result = await rewardDatasource.getRewardDetail(id);
      const resultData: RewardListType = {
        ...result,
      };
      if (resultData.score && +resultData.score > currentPoint) {
        setCounter(1);
        setCantExchange(true);
      }
      setRewardDetail(resultData);
    } catch (e) {
      console.log(e);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getRewardById();
    setRefreshing(false);
  };
  useEffect(() => {
    if (id) {
      getRewardById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onRedeemDigital = async () => {
    try {
      setDisableExchange(true);
      const farmerId = await AsyncStorage.getItem('farmer_id');
      const payload: any = {
        rewardId: id,
        quantity: 1,
        farmerId,
        updateBy: `${user?.firstname} ${user?.lastname}`,
        receiverDetail: {
          firstname: user?.firstname,
          lastname: user?.lastname,
          tel: user?.telephoneNo,
        },
      };
      const result = await rewardDatasource.onRedeemReward(payload);
      await getCurrentPoint();
      await getProfileAuth();
      setShowSuccessExchangeModal(true);
      setResultRedeemDigital(result);
      setDisableExchange(false);
    } catch (e) {
      console.log(e);
    } finally {
      setDisableExchange(false);
    }
  };

  const isOverRemain = useMemo(() => {
    if (rewardDetail.remain) {
      return counter > rewardDetail.remain;
    }
  }, [rewardDetail.remain, counter]);
  const onPressExchange = () => {
    navigation.navigate('RedeemSelectAddressScreen', {
      data: {
        ...rewardDetail,
        amountExchange: counter,
        usePoint: requirePoint * counter,
      },
    });
  };
  const isEnoughPoint = useMemo(() => {
    if (rewardDetail.score) {
      return +rewardDetail.score <= currentPoint;
    }
    return false;
  }, [currentPoint, rewardDetail.score]);

  const { disableButton, notEnoughPoint } = useMemo(() => {
    const isDisableMinus = counter <= 1;

    const disableButton = counter * requirePoint > currentPoint;
    const isDisablePlus = (counter + 1) * requirePoint > currentPoint;

    return {
      isLimit: counter * requirePoint >= currentPoint,
      isDisableMinus,
      isDisablePlus,
      disableButton: disableButton,
      notEnoughPoint: counter * requirePoint > currentPoint,
    };
  }, [counter, currentPoint, requirePoint]);
  return (
    <SafeAreaView
      edges={['left', 'right', 'top']}
      style={{ flex: 1, backgroundColor: colors.greenLight }}>
      <View
        style={{
          width: '100%',
          position: 'relative',
          zIndex: 999,
        }}>
        <CustomHeader
          showBackBtn
          styleWrapper={{
            backgroundColor: colors.greenLight,
            paddingBottom: 16,
          }}
          onPressBack={() => {
            mixpanel.track('กดกลับจากหน้ารายละเอียดรีวอร์ด');
            navigation.goBack();
          }}
          title="แลกรางวัล"
          titleColor="white"
        />
        <View
          style={{
            height: 54,
            position: 'absolute',
            bottom: -28,
            width: '100%',
            alignItems: 'center',
          }}>
          <ShowCurrentPoint />
        </View>
      </View>

      <ScrollView
        scrollIndicatorInsets={{
          right: 1,
        }}
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingTop: 48,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <ProgressiveImage
            source={{
              uri: rewardDetail.imagePath,
            }}
            style={{
              height: width,
              width: width,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.greyDivider,
            }}
          />
        </View>

        <View style={styles({ disable: disableButton }).container}>
          <RenderHTML
            tagsStyles={{
              body: {
                fontSize: 24,
                fontFamily: font.AnuphanSemiBold,
                color: colors.fontBlack,
              },
            }}
            systemFonts={[font.AnuphanSemiBold]}
            contentWidth={width}
            source={{
              html: rewardDetail?.rewardName || '',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  marginTop: 8,
                  fontFamily: font.AnuphanSemiBold,
                }}>
                ใช้แต้ม {numberWithCommas(requirePoint.toString(), true)} แต้ม
              </Text>
            </View>
          </View>

          {isDigital && (
            <View style={styles({}).flewRow}>
              <View
                style={{
                  borderRadius: 10,
                  padding: 10,
                  minHeight: 62,
                  marginTop: 16,
                  backgroundColor: colors.skySoft,
                  width: 'auto',
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.AnuphanMedium,
                    color: colors.skyDark,
                  }}>
                  แลกได้ถึง
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.AnuphanSemiBold,
                    color: colors.fontBlack,
                  }}>
                  {momentExtend.toBuddhistYear(
                    rewardDetail?.expiredUsedDate?.toString() || '',
                    'DD MMMM YYYY',
                  )}
                </Text>
              </View>
              <View
                style={{
                  width: 8,
                }}
              />
              <View
                style={{
                  borderRadius: 10,
                  padding: 10,
                  minHeight: 62,
                  marginTop: 16,
                  backgroundColor: colors.lightOrange,
                  flex: 1,
                  width: 'auto',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.AnuphanSemiBold,
                    color: colors.orangeDarkest,
                  }}>
                  ใช้ได้ถึง
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.AnuphanMedium,
                    color: colors.fontBlack,
                  }}>
                  {momentExtend.toBuddhistYear(
                    rewardDetail?.expiredUsedDate?.toString() || '',
                    'DD MMMM YYYY',
                  )}
                </Text>
              </View>
            </View>
          )}

          <View
            style={{
              marginTop: 16,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.AnuphanMedium,
                color: colors.fontBlack,
              }}>
              รายละเอียด
            </Text>
            <RenderHTML
              source={{
                html: rewardDetail.description || '',
              }}
              contentWidth={width}
              systemFonts={[font.SarabunRegular]}
              tagsStyles={{
                body: {
                  fontSize: 18,
                  fontFamily: font.SarabunRegular,
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
                fontSize: 18,
                fontFamily: font.AnuphanMedium,
                color: colors.fontBlack,
              }}>
              เงื่อนไข
            </Text>
            <RenderHTML
              systemFonts={[font.SarabunRegular]}
              source={{
                html: rewardDetail.condition || '',
              }}
              contentWidth={width}
              tagsStyles={{
                body: {
                  fontSize: 18,
                  fontFamily: font.SarabunRegular,
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
      <View style={styles({ disable: disableButton }).footer}>
        {isDigital ? (
          <TouchableOpacity
            disabled={!isEnoughPoint}
            style={styles({ disable: !isEnoughPoint }).button}
            onPress={() => {
              mixpanel.track('กดแลกแต้มแบบdigital');
              setIsConfirm(true);
            }}>
            <Text style={styles({ disable: !isEnoughPoint }).textButton}>
              แลกของรางวัล
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={disableButton || isOverRemain}
            style={styles({ disable: disableButton || isOverRemain }).button}
            onPress={() => {
              mixpanel.track('กดแลกแต้มแบบphysical');
              // onPressExchange();
              setShowCounter(true);
            }}>
            <Text style={styles({ disable: disableButton }).textButton}>
              แลกของรางวัล
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ModalCaseDigital
        disableExchange={disableExchange}
        id={id}
        isConfirm={isConfirm}
        navigation={navigation}
        onRedeemDigital={onRedeemDigital}
        resultRedeemDigital={resultRedeemDigital}
        rewardDetail={rewardDetail}
        setIsConfirm={setIsConfirm}
        setShowSuccessExchangeModal={setShowSuccessExchangeModal}
        showSuccessExchangeModal={showSuccessExchangeModal}
      />
      <ModalCasePhysical
        showCounter={showCounter}
        setShowCounter={setShowCounter}
        counter={counter}
        setCounter={setCounter}
        isOverRemain={isOverRemain}
        notEnoughPoint={notEnoughPoint}
        requirePoint={requirePoint * counter}
        onPressPrimary={onPressExchange}
      />
    </SafeAreaView>
  );
}

const styles = ({ disable }: { disable?: boolean }) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    amountContainer: {
      paddingTop: 8,
      paddingLeft: 16,
      paddingRight: 40,
      backgroundColor: colors.greenLight,
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
      fontFamily: font.AnuphanSemiBold,
      color: colors.white,
    },
    button: {
      width: '100%',
      backgroundColor: disable ? colors.disable : colors.greenLight,
      borderRadius: 12,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: disable ? colors.disable : colors.greenLight,
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
    flewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
