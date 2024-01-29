import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import React, { useEffect, useMemo } from 'react';
import { colors, font } from '../../assets';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import CustomHeader from '../../components/CustomHeader';
import { rewardDatasource } from '../../datasource/RewardDatasource';
import { usePoint } from '../../contexts/PointContext';

import { mixpanel } from '../../../mixpanel';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import { RewardListType } from '../../types/RewardType';
import { numberWithCommas } from '../../functions/utility';
import Text from '../../components/Text/Text';
import RenderHTML from 'react-native-render-html';
import { momentExtend } from '../../utils/moment-buddha-year';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShowCurrentPoint from '../../components/ShowCurrentPoint/ShowCurrentPoint';

interface Props {
  navigation: StackNavigationHelpers;
  route: RouteProp<MainStackParamList, 'RewardDetailReadOnlyScreen'>;
}

export default function RewardDetailReadOnlyScreen({
  navigation,
  route,
}: Props) {
  const { isDigital, id } = route.params;

  const width = useWindowDimensions().width - 32;
  const [refreshing, setRefreshing] = React.useState(false);
  const { currentPoint } = usePoint();

  const [rewardDetail, setRewardDetail] = React.useState<RewardListType>(
    {} as RewardListType,
  );

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

  return (
    <SafeAreaView
      edges={['left', 'right', 'top']}
      style={{ flex: 1, backgroundColor: colors.white }}>
      <View
        style={{
          width: '100%',
          position: 'relative',
          zIndex: 999,
        }}>
        <CustomHeader
          showBackBtn
          styleWrapper={{
            backgroundColor: colors.white,
            height: 52,
          }}
          onPressBack={() => {
            navigation.goBack();
          }}
          title="รายละเอียดรางวัล"
        />
      </View>

      <ScrollView
        scrollIndicatorInsets={{
          right: 1,
        }}
        style={{
          flex: 1,
          backgroundColor: colors.white,
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

        <View style={styles({ disable: false }).container}>
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
                  backgroundColor: colors.lightOrange,
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
              height: 100,
            }}
          />
        </View>
      </ScrollView>
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
