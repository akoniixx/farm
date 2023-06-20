import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, font, icons} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {numberWithCommas} from '../../function/utility';
import ListReward from './ListReward';
import image from '../../assets/images/image';
import {usePoint} from '../../contexts/PointContext';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {useFocusEffect} from '@react-navigation/native';
import {mixpanel} from '../../../mixpanel';

export default function RewardScreen({navigation}: any) {
  const {currentPoint, getCurrentPoint} = usePoint();
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const getPoint = async () => {
        try {
          await getCurrentPoint();
        } catch (e) {
          console.log(e);
        }
      };
      getPoint();
    }, [getCurrentPoint]),
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <TouchableOpacity
            style={{
              flex: 0.48,
            }}
            onPress={() => {
              mixpanel.track('กดดูประวัติการใช้คะแนนจากหน้ารีวอร์ด');
              navigation.navigate('PointHistoryScreen');
            }}>
            <LinearGradient
              colors={['#FA7052', '#F89132']}
              start={{x: 0, y: 0}}
              end={{x: 0.8, y: 1}}
              style={styles.containerPoint}>
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
                  {numberWithCommas(currentPoint.toString(), true)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.white,

                    fontFamily: font.medium,
                  }}>
                  Droner Point
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              mixpanel.track('กดดูรีวอร์ดของฉัน');
              navigation.navigate('MyRewardScreen', {
                tab: 'readyToUse',
              });
            }}
            style={{
              minHeight: 64,
              flex: 0.48,
              borderWidth: 1,
              borderColor: colors.orange,
              borderRadius: 12,
            }}>
            <ImageBackground
              imageStyle={{
                borderRadius: 12,
              }}
              source={image.bgMyReward}
              style={{
                borderRadius: 12,
                justifyContent: 'center',
                width: '100%',
                height: 64,
              }}>
              <View
                style={{
                  marginLeft: 16,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.bold,
                    color: colors.fontBlack,
                  }}>
                  รีวอร์ด
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: font.medium,
                    color: colors.fontBlack,
                  }}>
                  ของฉัน
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 16,
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: font.bold,
              paddingHorizontal: 16,
              color: colors.fontBlack,
            }}>
            ของรางวัล/รีวอร์ด
          </Text>
          <ListReward navigation={navigation} setLoading={setLoading} />
        </View>
      </View>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{color: '#FFF'}}
      />
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
    width: '100%',
  },
  container: {
    paddingVertical: 16,
  },
});
