import {View, StyleSheet, Image, Dimensions} from 'react-native';
import React, {useMemo} from 'react';
import {colors} from '../../assets';
import Text from '../../components/Text';
import fonts from '../../assets/fonts';
import ProgressBarAnimated from '../../components/ProgressBarAnimated/ProgressBarAnimated';
import moment from 'moment';
import {momentExtend, numberWithCommas} from '../../function/utility';
import icons from '../../assets/icons/icons';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';

interface Props {
  disabled?: boolean;
  cardData: any;
  dateEnd: string;
  total: number;
  current: number;
  missionName: string;
  imagePath: any;
  isMissionPoint?: boolean;
}
export default function CardDetail({
  disabled = false,
  dateEnd,
  cardData,
  current,
  total,
  missionName,
  imagePath,
  isMissionPoint = false,
}: Props) {
  const isSuccess = useMemo(() => {
    return current / total >= 1;
  }, [current, total]);
  const isLessThanDay = moment(dateEnd).diff(moment(), 'days') <= 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: disabled ? colors.softGrey2 : colors.white,
        },
      ]}>
      <View style={styles.row}>
        {disabled ? (
          <Grayscale>
            {isMissionPoint ? (
              <Image
                source={imagePath}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                }}
              />
            ) : (
              <ProgressiveImage
                source={{
                  uri: imagePath,
                }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                }}
              />
            )}
          </Grayscale>
        ) : (
          <>
            {isMissionPoint ? (
              <Image
                source={imagePath}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                }}
              />
            ) : (
              <ProgressiveImage
                source={{
                  uri: imagePath,
                }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                }}
              />
            )}
          </>
        )}

        <View
          style={{
            marginLeft: 16,
            flex: 1,
            alignSelf: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: disabled ? colors.gray : colors.fontBlack,
              fontFamily: fonts.bold,
            }}>
            {missionName}
          </Text>
          <Text
            style={{
              marginTop: 4,
            }}>
            {cardData.rewardName}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <ProgressBarAnimated
          current={current}
          total={total}
          isDisabled={disabled}
        />
      </View>
      <View
        style={[
          styles.row,
          {
            marginTop: 8,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          },
        ]}>
        <View
          style={[
            styles.row,
            {
              alignItems: 'flex-start',
              flex: 0.7,
            },
          ]}>
          <Text
            style={{
              width: '100%',
            }}>
            {`หมดเขต ${momentExtend.toBuddhistYear(dateEnd, 'DD MMM YY')}  `}
            {!disabled && (
              <Text>
                {isLessThanDay
                  ? `(อีก ${moment(dateEnd).fromNow()})`
                  : `(อีก ${moment(dateEnd).diff(moment(), 'days')} วัน)`}
              </Text>
            )}
          </Text>
        </View>
        <View
          style={[
            styles.row,
            {
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: 0.3,
            },
          ]}>
          <Text
            style={{
              color: disabled ? colors.gray : colors.orange,
              fontFamily: fonts.bold,
            }}>
            {numberWithCommas(current.toString(), true)}
          </Text>
          <Text
            style={{
              color: disabled ? colors.gray : colors.fontBlack,

              fontFamily: fonts.bold,
            }}>
            /{numberWithCommas(total.toString(), true)}
          </Text>
          {isSuccess && (
            <Image
              source={icons.checkFillSuccess}
              style={{
                width: 16,
                height: 16,
                marginLeft: 4,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  card: {
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
    minHeight: 124,
    marginBottom: 16,
  },
});
