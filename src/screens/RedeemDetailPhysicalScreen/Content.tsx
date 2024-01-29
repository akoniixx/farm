import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { colors, font, icons } from '../../assets';
import { RedeemDetail } from '.';
import Clipboard from '@react-native-community/clipboard';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import RenderHTML from 'react-native-render-html';
import Text from '../../components/Text/Text';
import { momentExtend } from '../../utils/moment-buddha-year';
import { numberWithCommas } from '../../functions/utility';
import PopUp from '../../components/PopUp';

interface Props {
  redeemDetail: RedeemDetail;
  navigation: any;
}
const mappingStatus = {
  REQUEST: 'คำร้องขอแลก',
  PREPARE: 'เตรียมจัดส่ง',
  DONE: 'ส่งแล้ว',
  CANCEL: 'ยกเลิก',
  EXPIRED: 'หมดอายุ',
  USED: 'ใช้แล้ว',
};
const mappingStatusColor = {
  REQUEST: '#EBBB00',
  PREPARE: colors.orange,
  DONE: colors.greenLight,
  CANCEL: colors.errorText,
  EXPIRED: colors.errorText,
  USED: colors.greenLight,
};
export default function Content({ redeemDetail, navigation }: Props) {
  const width = Dimensions.get('window').width;
  const [isCopy, setIsCopy] = React.useState(false);
  const { isDone, isCancel } = useMemo(() => {
    return {
      isDone: redeemDetail.redeemDetail.redeemStatus === 'DONE',
      isCancel: redeemDetail.redeemDetail.redeemStatus === 'CANCEL',
    };
  }, [redeemDetail.redeemDetail.redeemStatus]);

  const onCopyClipboard = async (text: string) => {
    Clipboard.setString(text);
    setIsCopy(true);
  };
  useEffect(() => {
    if (isCopy) {
      setTimeout(() => {
        setIsCopy(false);
      }, 1000);
    }
  }, [isCopy]);
  const onPressSeeDetail = () => {
    navigation.navigate('RewardDetailReadOnlyScreen', {
      id: redeemDetail.reward.id,
      isDigital: redeemDetail.reward.rewardType === 'DIGITAL',
      isReadOnly: true,
    });
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <View style={styles.container}>
          <View>
            <ProgressiveImage
              source={{ uri: redeemDetail?.reward?.imagePath }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.greyDivider,
              }}
            />
          </View>
          <View
            style={{
              width: 16,
            }}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
            }}>
            <RenderHTML
              contentWidth={width * 0.8}
              systemFonts={[font.AnuphanSemiBold]}
              source={{ html: redeemDetail.reward.rewardName }}
              tagsStyles={{
                body: {
                  fontSize: 20,
                  fontFamily: font.AnuphanSemiBold,
                  color: colors.fontBlack,
                  marginTop: 4,
                  alignSelf: 'flex-start',
                },
              }}
            />
            <Text
              style={{
                marginTop: 4,
                fontSize: 16,
                fontFamily: font.SarabunMedium,
                color: colors.grey60,
              }}>
              สถานะ :{' '}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.SarabunMedium,
                  color:
                    mappingStatusColor[
                      redeemDetail.redeemDetail
                        .redeemStatus as keyof typeof mappingStatusColor
                    ],
                }}>
                {
                  mappingStatus[
                    redeemDetail.redeemDetail
                      .redeemStatus as keyof typeof mappingStatus
                  ]
                }
              </Text>
            </Text>
          </View>
        </View>
        {redeemDetail.redeemDetail.redeemStatus !== 'DONE' &&
          redeemDetail.redeemDetail.redeemStatus !== 'CANCEL' && (
            <View
              style={{
                borderBottomColor: colors.grey5,
                borderBottomWidth: 1,
                padding: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.SarabunRegular,
                  color: colors.grey60,
                }}>
                บริษัทจะจัดส่งสินค้า/ของรางวัลให้ท่านภายใน 14 วันทำการ
              </Text>
            </View>
          )}
        {isDone && (
          <View
            style={{
              borderBottomColor: colors.grey5,
              borderBottomWidth: 1,
              padding: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,

                  fontFamily: font.SarabunMedium,
                  color: colors.fontBlack,
                }}>
                หมายเลขพัสดุ :{' '}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  onCopyClipboard(redeemDetail.redeemDetail.trackingNo || '');
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.SarabunRegular,
                    color: colors.fontBlack,
                    lineHeight: 28,
                  }}>
                  {redeemDetail.redeemDetail.trackingNo || '-'}
                </Text>
                <Image
                  source={isCopy ? icons.correct : icons.copyClipboard}
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 8,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,

                  fontFamily: font.SarabunMedium,
                  color: colors.fontBlack,
                }}>
                บริษัทจัดส่ง :{' '}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunRegular,

                  color: colors.fontBlack,
                  lineHeight: 28,
                }}>
                {redeemDetail.redeemDetail.deliveryCompany || '-'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,

                  fontFamily: font.SarabunMedium,
                  color: colors.fontBlack,
                }}>
                หมายเหตุ :{' '}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunRegular,
                  color: colors.fontBlack,
                  lineHeight: 28,
                }}>
                {redeemDetail.redeemDetail.remark || '-'}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.SarabunRegular,
                color: colors.grey60,
              }}>
              บริษัทจะจัดส่งสินค้า/ของรางวัลให้ท่านภายใน 14 วันทำการ
            </Text>
          </View>
        )}
        {isCancel && (
          <View
            style={{
              borderBottomColor: colors.greyDivider,
              borderBottomWidth: 1,
              padding: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 28,

                  fontFamily: font.SarabunRegular,
                  color: colors.grey60,
                }}>
                หมายเหตุ :{' '}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunMedium,

                  color: colors.fontBlack,
                  lineHeight: 28,
                }}>
                {redeemDetail.redeemDetail.remark || '-'}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 28,

                fontFamily: font.SarabunRegular,
                color: colors.grey60,
              }}>
              จำนวน
            </Text>
            <Text
              style={{
                fontSize: 18,

                fontFamily: font.SarabunMedium,
                color: colors.fontBlack,
                lineHeight: 28,
              }}>
              {redeemDetail.redeemDetail.rewardQuantity}
            </Text>
          </View>
          {/* {!!redeemDetail?.redeemDetail.missionName && (
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.grey2,
                lineHeight: 28,
              }}>
              จากภารกิจ
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                lineHeight: 28,
                color: colors.orange,
              }}>
              {redeemDetail.redeemDetail.missionName}
            </Text>
          </View>
        )} */}

          {!!redeemDetail?.amountValue && (
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 18,

                  fontFamily: font.SarabunRegular,
                  color: colors.grey60,
                  lineHeight: 28,
                }}>
                แต้มที่ใช้แลก
              </Text>
              <Text
                style={{
                  fontSize: 18,

                  fontFamily: font.SarabunMedium,
                  color: colors.errorText,
                  lineHeight: 28,
                }}>
                {numberWithCommas(redeemDetail.amountValue.toString(), true)}{' '}
                แต้ม
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 18,

                fontFamily: font.SarabunRegular,
                color: colors.grey60,
                lineHeight: 28,
              }}>
              วัน/เวลาที่ทำรายการ
            </Text>
            <Text
              style={{
                fontSize: 18,

                fontFamily: font.SarabunMedium,
                lineHeight: 28,
              }}>
              {momentExtend.toBuddhistYear(
                redeemDetail.createAt,
                'DD MMM YYYY HH:mm',
              )}
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 18,

                lineHeight: 28,

                fontFamily: font.SarabunRegular,
                color: colors.grey60,
              }}>
              รหัสการทำรายการ
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.SarabunMedium,
                lineHeight: 28,

                color: colors.fontBlack,
              }}>
              {redeemDetail.redeemNo}
            </Text>
          </View>
        </View>
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: font.AnuphanSemiBold,
              color: colors.fontBlack,
              lineHeight: 28,
            }}>
            ที่อยู่จัดส่ง
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: font.SarabunRegular,
              color: colors.grey60,
              marginVertical: 4,
            }}>
            ชื่อ-นามสกุล : {redeemDetail?.receiverDetail.firstname}{' '}
            {redeemDetail?.receiverDetail.lastname}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: font.SarabunRegular,
              color: colors.grey60,
              marginVertical: 4,
            }}>
            เบอร์โทรศัพท์ : {redeemDetail?.receiverDetail.tel}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              width: '90%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.SarabunRegular,
                color: colors.grey60,
                marginVertical: 4,
                alignSelf: 'flex-start',
                lineHeight: 24,
                textAlignVertical: 'top',
              }}>
              ที่อยู่ :
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.SarabunRegular,
                color: colors.grey60,
                marginVertical: 4,
                alignSelf: 'flex-start',
                lineHeight: 24,
                textAlignVertical: 'top',
              }}>
              {redeemDetail?.receiverDetail?.address}
            </Text>
          </View>
        </View>

        <PopUp setIsVisible={setIsCopy} isVisible={isCopy}>
          <View
            style={{
              padding: 16,
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: 'rgba(0,0,0,0.9)',
              borderRadius: 8,
            }}>
            <Image
              source={icons.correct}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.SarabunMedium,
                color: colors.white,
              }}>
              คัดลอกเรียบร้อย
            </Text>
          </View>
        </PopUp>
      </View>

      <View
        style={{
          marginTop: 16,
          marginBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          style={styles.buttonDetail}
          onPress={onPressSeeDetail}>
          <Text
            style={{
              color: colors.fontBlack,
              fontSize: 20,
              fontFamily: font.AnuphanSemiBold,
            }}>
            รายละเอียด
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomColor: colors.grey5,
    borderBottomWidth: 1,
    borderTopColor: colors.grey5,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  content: {
    padding: 16,
    borderBottomColor: colors.grey5,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: colors.orange,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F86820',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  buttonDetail: {
    borderColor: colors.grey60,
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    borderRadius: 8,
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
});
