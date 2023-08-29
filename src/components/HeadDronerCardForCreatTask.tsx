import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { font, icons } from '../assets';
import { normalize } from '../functions/Normalize';

interface Prop {
  navigation: any;
  image: string;
  name: string;
}

const HeadDronerCardForCreatTask: React.FC<Prop> = ({
  image,
  name,
  navigation,
}) => {
  return (
    <View
      style={{
        backgroundColor: 'rgba(46, 196, 109, 0.05)',
        alignItems: 'center',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(16),
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderColor: '#A1E9BF',
          borderWidth: 1,
          width: '100%',
          borderRadius: 8,
          padding: normalize(12),
          backgroundColor: '#F7FFF0',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{
              height: normalize(32),
              width: normalize(32),
              borderRadius: 50,
              marginRight: normalize(8),
            }}
            source={{ uri: image }}
          />
          <Text
            style={{
              fontFamily: font.SarabunMedium,
              fontSize: normalize(18),
              color: '#5F6872',
            }}>
            {name}
          </Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'baseline' }}
          onPress={() => {
            navigation.push('DronerDetail');
          }}>
          <Text
            style={{
              fontFamily: font.SarabunMedium,
              fontSize: normalize(18),
              color: '#5F6872',
            }}>
            คิวงาน
          </Text>
          <Image
            source={icons.arrowRightGrey}
            style={{ width: normalize(28), height: normalize(16) }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default HeadDronerCardForCreatTask;
