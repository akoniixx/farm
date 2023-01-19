import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import InputWithSuffix from '../InputText/InputWithSuffix';
import Radio from '../Radio/Radio';

interface Prop {
  id: string;
  plotName: string;
  raiAmount: number;
  plantName: string;
  locationName: string;
  onPress: () => void;
  selected: boolean;
}

const PlotSelect: React.FC<Prop> = ({
  plotName,
  raiAmount,
  plantName,
  locationName,
  selected,
  onPress,
}) => {
  const radioList = [
    {
      title: 'ทั้งหมด',
      value: 'all',
      key: 'all',
    },
    {
      title: 'กำหนดเอง',
      value: 'custom',
      key: 'custom',
    },
  ];
  const [customValue, setCustomValue] = React.useState<string>('');
  const [checkValue, setCheckValue] = React.useState<string>('all');
  useEffect(() => {
    if (raiAmount) {
      setCustomValue(raiAmount.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '100%',
      }}>
      <View
        style={[
          styles.card,
          selected && styles.selected,
          { justifyContent: 'center' },
        ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.h1}>{plotName}</Text>
          <Image
            style={{ width: normalize(24), height: normalize(24) }}
            source={selected ? image.checked : image.uncheck}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
          <Image
            source={icons.plot}
            style={{
              width: normalize(18),
              height: normalize(20),
              marginRight: normalize(10),
            }}
          />
          <Text
            style={{
              fontFamily: fonts.SarabunMedium,
              fontSize: normalize(16),
              color: colors.fontGrey,
              marginRight: '40%',
              bottom: 2,
            }}>
            {raiAmount + ' ' + 'ไร่'}
          </Text>
          <Image
            source={icons.plant}
            style={{
              width: normalize(18),
              height: normalize(20),
              marginRight: normalize(10),
            }}
          />
          <Text
            style={{
              fontFamily: fonts.SarabunMedium,
              fontSize: normalize(16),
              color: colors.fontGrey,
              marginRight: '10%',
              bottom: 2,
            }}>
            {plantName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
          <Image
            source={icons.location}
            style={{
              width: normalize(18),
              height: normalize(20),
              marginRight: normalize(10),
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.SarabunMedium,
              fontSize: normalize(16),
              color: colors.fontGrey,
              marginRight: '10%',

              bottom: 2,
            }}>
            {locationName}
          </Text>
        </View>
        {selected && (
          <>
            <View
              style={{ height: 1, backgroundColor: '#C7F2D9', marginTop: 8 }}
            />
            <View
              style={{
                marginTop: 16,
                backgroundColor: '#FFFFEB',
                minHeight: 160,
                borderRadius: 10,
                padding: 8,
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: 20,
                  color: colors.primary,
                }}>
                จำนวนไร่ที่ต้องการฉีด
              </Text>
              <Radio
                radioLists={radioList}
                horizontal
                value={checkValue}
                style={{ marginVertical: 8 }}
                onChange={(value: string) => {
                  setCheckValue(value);
                }}
              />
              <InputWithSuffix
                value={customValue}
                onChangeText={text => {
                  const newNumber = text.replace(/[^0-9]/g, '');
                  if (+text !== +customValue) {
                    setCheckValue('custom');
                  }

                  if (+text === +raiAmount) {
                    setCheckValue('all');
                  }
                  setCustomValue(newNumber);
                }}
                keyboardType="numeric"
                suffixComponent={
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: 20,
                      color: '#8D96A0',
                    }}>
                    ไร่
                  </Text>
                }
              />
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PlotSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: Dimensions.get('window').width - normalize(20),
    minHeight: normalize(130),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#C0C5CA',
    margin: normalize(10),
    borderRadius: normalize(10),
    padding: normalize(10),
  },
  selected: {
    borderColor: '#2EC46D',
    backgroundColor: 'rgba(46, 196, 109, 0.05)',
    borderWidth: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  h1: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(20),
    colors: '#0D381F',
  },
});
