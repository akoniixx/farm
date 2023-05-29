import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {colors, font, icons, image} from '../../assets';
import Text from '../Text';
import ProgressBarAnimated from '../ProgressBarAnimated/ProgressBarAnimated';
import mockImage from '../../assets/mockImage';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import {numberWithCommas} from '../../function/utility';
interface Props {
  onPress?: () => void;
  isDouble?: boolean;
  isComplete?: boolean;
  isExpire?: boolean;
  isFullQuota?: boolean;
  title?: string;
  desc?: string;
  current?: number;
  total?: number;
  imageSource?: any;
}
export default function CardMission({
  isComplete = false,
  isDouble = false,
  isFullQuota = true,
  isExpire = false,
  current = 30,
  total = 100,
  imageSource = mockImage.reward2,
}: Props) {
  return (
    <View style={styles.card}>
      <View
        style={{
          flex: 0.8,
          height: '100%',
          justifyContent: 'flex-start',
          paddingRight: 32,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: font.bold,
          }}>
          บินสะสมครบ 100 ไร่ (400 แต้ม)
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontSize: 14,
            fontFamily: font.light,
          }}>
          รับเสื้อไอคอนเกษตร มูลค่า 500 บาท
        </Text>

        <ProgressBarAnimated current={current} total={total} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {isComplete && (
              <Image
                source={icons.successIcon}
                style={{
                  width: 24,
                  height: 20,
                  marginRight: 4,
                }}
              />
            )}

            <Text
              style={{
                fontSize: 14,
              }}>
              {numberWithCommas(current.toString(), true)}/
              {numberWithCommas(total.toString(), true)}
            </Text>
          </View>

          {isComplete && (
            <Text
              style={{
                fontSize: 14,
                color: colors.decreasePoint,
              }}>
              รอยืนยันที่อยู่จัดส่ง
            </Text>
          )}
        </View>
      </View>
      <View style={{flex: 0.2, position: 'relative'}}>
        {isComplete && (
          <>
            <View
              style={{
                width: 68,
                height: 68,
                zIndex: 1,
                opacity: 0.7,
                position: 'absolute',
                borderRadius: 34,
                backgroundColor: '#2AB263',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <Image
              source={image.successStamp}
              style={{
                width: 40,
                height: 34,
                position: 'absolute',
                zIndex: 2,
                top: '20%',
                left: '20%',
              }}
            />
          </>
        )}
        {isExpire || isFullQuota ? (
          <Grayscale>
            <Image
              source={imageSource}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
              }}
            />
            {isFullQuota && (
              <>
                <View
                  style={{
                    width: 68,
                    height: 68,
                    zIndex: 1,
                    opacity: 0.6,
                    position: 'absolute',
                    borderRadius: 34,
                    backgroundColor: colors.fontGrey,

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
                <Image
                  source={image.fullQuota}
                  style={{
                    width: 50,
                    height: 24,
                    position: 'absolute',
                    zIndex: 2,
                    top: '30%',
                    left: '10%',
                  }}
                />
              </>
            )}

            {isDouble && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  zIndex: 2,
                  borderRadius: 12,
                  backgroundColor: colors.disable,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.white,
                }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 14,
                    fontFamily: font.bold,
                    lineHeight: 0,
                  }}>
                  x2
                </Text>
              </View>
            )}
          </Grayscale>
        ) : (
          <>
            <Image
              source={imageSource}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
              }}
            />
            {isDouble && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  zIndex: 2,
                  borderRadius: 12,
                  backgroundColor: colors.orange,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.white,
                }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 14,
                    fontFamily: font.bold,
                    lineHeight: 0,
                  }}>
                  x2
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.disable,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 124,
    marginBottom: 16,
  },
});
