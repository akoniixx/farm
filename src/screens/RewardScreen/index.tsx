import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors, font, icons} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {numberWithCommas} from '../../function/utility';
import ListReward from './ListReward';

export default function RewardScreen({navigation}: any) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#FA7052', '#F89132']}
          start={{x: 0, y: 0}}
          end={{x: 0.8, y: 1}}
          style={styles.containerPoint}>
          <TouchableOpacity
            onPress={() => navigation.navigate('HistoryRewardScreen')}
            style={{
              flexDirection: 'row',
              flex: 0.5,
            }}>
            <Image
              source={icons.ICKDronerPoint}
              style={{
                width: 32,
                height: 32,
                marginRight: 8,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  color: colors.white,
                }}>
                {numberWithCommas(`123000`, true)}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.white,

                  fontFamily: font.medium,
                }}>
                โดรนเนอร์ พอยต์
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderLeftWidth: 1,
              minHeight: 40,
              borderColor: colors.white,
            }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('MyRewardScreen')}
            style={{
              flexDirection: 'row',
              flex: 0.5,
              minHeight: 40,
            }}>
            <Text
              style={{
                marginLeft: 16,
                fontSize: 18,
                fontFamily: font.bold,
                color: colors.white,
              }}>
              รีวอร์ดของฉัน
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <View
          style={{
            marginTop: 16,
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: font.bold,
              color: colors.fontBlack,
            }}>
            รีวอร์ดทั้งหมด
          </Text>
          <ListReward navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containerPoint: {
    paddingHorizontal: 12,
    minHeight: 64,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    padding: 16,
  },
});
