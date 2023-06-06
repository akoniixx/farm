import {View, StyleSheet, Image} from 'react-native';
import React, {useMemo} from 'react';
import {colors, image} from '../../assets';
import mockImage from '../../assets/mockImage';
import Text from '../../components/Text';
import fonts from '../../assets/fonts';
import ProgressBarAnimated from '../../components/ProgressBarAnimated/ProgressBarAnimated';
import moment from 'moment';
import {momentExtend} from '../../function/utility';
import icons from '../../assets/icons/icons';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import FastImage from 'react-native-fast-image';

interface Props {
  disabled?: boolean;
  cardData: any;
  dateEnd: string;
  total: number;
  current: number;
  missionName: string;
  imagePath: string;
}
export default function CardDetail({
  disabled = false,
  dateEnd,
  cardData,
  current,
  total,
  missionName,
  imagePath,
}: Props) {
  const isSuccess = useMemo(() => {
    return current / total >= 1;
  }, [current, total]);

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
            <Image
              source={mockImage.reward1}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
              }}
            />
          </Grayscale>
        ) : (
          <FastImage
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

        <View
          style={{
            marginLeft: 16,
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
        style={[styles.row, {marginTop: 8, justifyContent: 'space-between'}]}>
        <View style={styles.row}>
          <Text>{`หมดเขต ${momentExtend.toBuddhistYear(
            dateEnd,
            'DD MMM YY',
          )}`}</Text>
          {!disabled && (
            <Text
              style={{
                marginLeft: 8,
              }}>{`(อีก ${moment(dateEnd).diff(moment(), 'days')} วัน)`}</Text>
          )}
        </View>
        <View
          style={[
            styles.row,
            {
              alignItems: 'center',
            },
          ]}>
          <Text
            style={{
              color: disabled ? colors.gray : colors.orange,
              fontFamily: fonts.bold,
            }}>
            {current}
          </Text>
          <Text
            style={{
              color: disabled ? colors.gray : colors.fontBlack,

              fontFamily: fonts.bold,
            }}>
            /{total}
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
