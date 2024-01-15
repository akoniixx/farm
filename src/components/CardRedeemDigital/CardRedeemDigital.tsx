import { View, StyleSheet, Image } from 'react-native';
import React, { useMemo } from 'react';
import { font, image } from '../../assets';
import colors from '../../assets/colors/colors';
import DashedLine from 'react-native-dashed-line';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';
import Text from '../Text/Text';
import { DigitalRewardType } from '../../types/RewardType';
import { momentExtend } from '../../utils/moment-buddha-year';
const mappingStatusText = {
  REQUEST: 'พร้อมใช้งาน',
  USED: 'ใช้แล้ว',
  EXPIRED: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: colors.orange,
  USED: colors.greenLight,
  EXPIRED: colors.grey40,
  CANCEL: colors.errorText,
};
interface Props {
  imagePath: string;
  data: DigitalRewardType;
  expiredUsedDate: string;
}
export default function CardRedeemDigital({
  imagePath,
  data,
  expiredUsedDate,
}: Props) {
  const isExpired = React.useMemo(() => {
    return moment(expiredUsedDate).isBefore(moment());
  }, [expiredUsedDate]);
  const statusRedeem = useMemo(() => {
    if (isExpired) {
      return 'EXPIRED';
    }
    return data?.farmerTransaction?.redeemDetail?.redeemStatus;
  }, [data, isExpired]);
  const isUsed = React.useMemo(() => {
    return data?.farmerTransaction?.redeemDetail?.redeemStatus === 'USED';
  }, [data]);
  const isCancel = React.useMemo(() => {
    return data?.farmerTransaction?.redeemDetail?.redeemStatus === 'CANCEL';
  }, [data]);
  const isRequest = React.useMemo(() => {
    return (
      data?.farmerTransaction?.farmerRedeemHistories?.[0].status ===
        'REQUEST' && data?.farmerTransaction?.farmerRedeemHistories.length === 1
    );
  }, [data]);
  const usedData = React.useMemo(() => {
    return data?.farmerTransaction?.farmerRedeemHistories?.find(
      item => item.status === 'USED',
    );
  }, [data]) || { createAt: '' };
  const {
    state: { user },
  } = useAuth();

  if (!data) {
    return <View />;
  }

  return (
    <>
      <View style={styles.card}>
        <View
          style={{
            flex: 0.2,
          }}>
          <ProgressiveImage
            source={{
              uri: imagePath,
            }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            flex: 0.8,
            flexDirection: 'row',
            marginLeft: 24,
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 72,
          }}>
          <View
            style={{
              minHeight: 72,
            }}>
            <Text
              numberOfLines={3}
              style={{
                fontSize: 16,
                fontFamily: font.AnuphanBold,
              }}>
              {data?.farmerTransaction?.rewardName}
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                fontFamily: font.SarabunRegular,
                color: colors.grey40,
              }}>
              สถานะ :{' '}
              <Text
                style={{
                  fontFamily: font.SarabunSemiBold,
                  color:
                    mappingStatusColor[
                      statusRedeem as keyof typeof mappingStatusColor
                    ],
                }}>
                {
                  mappingStatusText[
                    statusRedeem as keyof typeof mappingStatusText
                  ]
                }
              </Text>
            </Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              flex: 0.2,
              alignItems: 'flex-end',
            }}>
            <Image
              source={icons.arrowRight}
              style={{
                width: 32,
                height: 32,
              }}
            />
          </TouchableOpacity> */}
        </View>
      </View>
      <DashedLine
        dashLength={14}
        dashGap={4}
        dashColor={colors.grey10}
        style={{
          marginHorizontal: 10,
        }}
      />
      <View style={styles.cardContent}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: font.SarabunRegular,
            }}>
            หมดอายุการใช้{' '}
            {momentExtend.toBuddhistYear(expiredUsedDate, 'DD MMM YYYY ')}
          </Text>
        </View>
        {isUsed ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={image.usedBanner}
              style={{
                position: 'absolute',
                height: 80,
                zIndex: 1,
              }}
            />
            <Text
              style={{
                fontSize: 32,
                opacity: 0.2,
                fontFamily: font.AnuphanBold,
              }}>
              {data.farmerTransaction.redeemDetail.digitalReward.redeemCode}
            </Text>
          </View>
        ) : isExpired ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={image.expiredBanner}
              style={{
                position: 'absolute',
                height: 80,
                zIndex: 1,
              }}
            />
            <Text
              style={{
                fontSize: 32,
                color: colors.grey20,
              }}>
              {data.farmerTransaction.redeemDetail.digitalReward.redeemCode}
            </Text>
          </View>
        ) : isCancel ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={image.cancelBanner}
              style={{
                position: 'absolute',
                height: 80,
                zIndex: 1,
              }}
            />
            <Text
              style={{
                fontSize: 32,
                opacity: 0.2,
                fontFamily: font.AnuphanBold,
              }}>
              {data.farmerTransaction.redeemDetail.digitalReward.redeemCode}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontSize: 32,
              fontFamily: font.AnuphanBold,
            }}>
            {data.farmerTransaction.redeemDetail.digitalReward.redeemCode}
          </Text>
        )}

        <View
          style={{
            width: '100%',
          }}>
          <View
            style={{
              padding: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: font.SarabunRegular,
                color: colors.grey60,
              }}>
              แลกโดย
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: font.SarabunRegular,
                  fontSize: 14,
                  color: colors.grey60,
                }}>
                {user?.firstname} {user?.lastname}
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunRegular,
                  color: colors.grey60,
                  fontSize: 14,
                  lineHeight: 26,
                }}>
                {isRequest ? 'แลกเมื่อ' : 'ใช้เมื่อ'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.grey60,
                  fontFamily: font.SarabunRegular,
                }}>
                {user?.telephoneNo}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.grey60,
                  fontFamily: font.SarabunRegular,
                }}>
                {momentExtend.toBuddhistYear(
                  isRequest
                    ? data.farmerTransaction.farmerRedeemHistories[0].createAt
                    : usedData?.createAt,
                  'DD MMM YYYY HH:mm',
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 32,
              width: '100%',
              justifyContent: 'center',
              backgroundColor: colors.primaryContainer,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              paddingHorizontal: 16,
            }}>
            <Text
              style={{
                fontFamily: font.SarabunRegular,
                color: colors.primary,
                fontSize: 12,
              }}>
              รหัสการทำรายการ {data.farmerTransaction.redeemNo}
            </Text>
          </View>
        </View>
      </View>

      {isCancel && data.farmerTransaction.redeemDetail?.remark && (
        <Text
          style={{
            marginTop: 8,
            paddingHorizontal: 16,
            alignSelf: 'flex-start',
            flex: 1,
            fontSize: 14,
          }}>
          หมายเหตุ : {data.farmerTransaction.redeemDetail.remark}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.grey30,
    borderRadius: 10,
    flexDirection: 'row',
    minHeight: 72,
  },
  cardContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.grey30,
    borderRadius: 10,
    backgroundColor: 'white',
    minHeight: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.blueBorder,
    borderRadius: 8,
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.errorText,
    padding: 8,
    marginTop: 16,
    minHeight: 58,
    flexDirection: 'row',
  },
});
