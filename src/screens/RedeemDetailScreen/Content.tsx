import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useMemo} from 'react';
import {colors, font, icons} from '../../assets';
import FastImage from 'react-native-fast-image';
import RenderHTML from '../../components/RenderHTML/RenderHTML';
import {RedeemDetail} from '.';
import {momentExtend, numberWithCommas} from '../../function/utility';
import Clipboard from '@react-native-community/clipboard';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

interface Props {
  redeemDetail: RedeemDetail;
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
  DONE: colors.green,
  CANCEL: colors.decreasePoint,
  EXPIRED: colors.decreasePoint,
  USED: colors.green,
};
export default function Content({redeemDetail}: Props) {
  const width = Dimensions.get('window').width;
  const [isCopy, setIsCopy] = React.useState(false);
  const {isDone, isCancel} = useMemo(() => {
    return {
      isDone: redeemDetail.redeemDetail.redeemStatus === 'DONE',
      isCancel: redeemDetail.redeemDetail.redeemStatus === 'CANCEL',
    };
  }, [redeemDetail.redeemDetail.redeemStatus]);

  const onCopyClipboard = async (text: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'copiedSuccess',
    });
  };
  console.log(JSON.stringify(redeemDetail, null, 2), 'redeemDetail');

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            flex: 0.2,
          }}>
          <FastImage
            source={{uri: redeemDetail?.reward?.imagePath}}
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
            }}
          />
        </View>
        <View style={{paddingLeft: 16, flex: 0.8}}>
          <RenderHTML
            contentWidth={width * 0.8}
            source={{html: redeemDetail.reward.rewardName}}
            tagsStyles={{
              body: {
                fontSize: 20,
                fontFamily: font.bold,
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
              fontFamily: font.medium,
              color: colors.gray,
            }}>
            สถานะ :{' '}
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
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
              borderBottomColor: colors.greys5,
              borderBottomWidth: 1,
              padding: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,
                color: colors.gray,
              }}>
              บริษัทจะจัดส่งสินค้า/ของรางวัลให้ท่านภายใน 14 วันทำการ
            </Text>
          </View>
        )}
      {isDone && (
        <View
          style={{
            borderBottomColor: colors.greys5,
            borderBottomWidth: 1,
            padding: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 28,

                fontFamily: font.medium,
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
                onCopyClipboard(
                  redeemDetail.dronerRedeemHistories[0].trackingNo || '-',
                );
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.light,
                  color: colors.fontBlack,
                  lineHeight: 28,
                }}>
                {redeemDetail.redeemDetail.trackingNo || '-'}
              </Text>
              <Image
                source={isCopy ? icons.checkFillSuccess : icons.copyClipboard}
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
                fontSize: 16,
                lineHeight: 28,

                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              บริษัทจัดส่ง :{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,

                color: colors.fontBlack,
                lineHeight: 28,
              }}>
              {redeemDetail.redeemDetail.deliveryCompany}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 28,

                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              หมายเหตุ :{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,

                color: colors.fontBlack,
                lineHeight: 28,
              }}>
              {redeemDetail.redeemDetail.remark}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.light,
              color: colors.gray,
            }}>
            บริษัทจะจัดส่งสินค้า/ของรางวัลให้ท่านภายใน 14 วันทำการ
          </Text>
        </View>
      )}
      {isCancel && (
        <View
          style={{
            borderBottomColor: colors.greys5,
            borderBottomWidth: 1,
            padding: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 28,

                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              หมายเหตุ :{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,

                color: colors.fontBlack,
                lineHeight: 28,
              }}>
              {redeemDetail.dronerRedeemHistories[0].remark}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.row}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 28,

              fontFamily: font.medium,
              color: colors.grey2,
            }}>
            จำนวน
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.medium,
              color: colors.fontBlack,
              lineHeight: 28,
            }}>
            {redeemDetail.rewardQuantity}
          </Text>
        </View>
        <View style={styles.row}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.medium,
              color: colors.grey2,
              lineHeight: 28,
            }}>
            แต้มที่ใช้แลก
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.medium,
              color: colors.decreasePoint,
              lineHeight: 28,
            }}>
            {numberWithCommas(redeemDetail.amountValue.toString(), true)} แต้ม
          </Text>
        </View>
        <View style={styles.row}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.medium,
              color: colors.grey2,
              lineHeight: 28,
            }}>
            วัน/เวลาที่ทำรายการ
          </Text>
          <Text
            style={{
              fontSize: 16,

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
              fontSize: 16,
              lineHeight: 28,

              fontFamily: font.medium,
              color: colors.grey2,
            }}>
            รหัสการทำรายการ
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.medium,
              lineHeight: 28,

              color: colors.fontBlack,
            }}>
            {redeemDetail.redeemNo}
          </Text>
        </View>
      </View>
      <View style={{padding: 16}}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: font.bold,
            color: colors.fontBlack,
          }}>
          ที่อยู่ในการจัดส่ง
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.light,
            color: colors.gray,
            marginVertical: 4,
          }}>
          ชื่อ-นามสกุล : {redeemDetail?.receiverDetail.firstname}{' '}
          {redeemDetail?.receiverDetail.lastname}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.light,
            color: colors.gray,
            marginVertical: 4,
          }}>
          เบอร์โทรศัพท์ : {redeemDetail?.receiverDetail.tel}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.light,
            color: colors.gray,
            marginVertical: 4,
            alignSelf: 'flex-start',
            width: '90%',
            lineHeight: 24,
          }}>
          ที่อยู่ : {redeemDetail?.receiverDetail?.address}
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomColor: colors.greys5,
    borderBottomWidth: 1,
    borderTopColor: colors.greys5,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  content: {
    padding: 16,
    borderBottomColor: colors.greys5,
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
    fontFamily: font.bold,
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
});
