import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons } from '../../assets';
import { usePoint } from '../../contexts/PointContext';
import { useFocusEffect } from '@react-navigation/native';
import { mixpanel } from '../../../mixpanel';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../../components/Text/Text';
import { numberWithCommas } from '../../functions/utility';
import image from '../../assets/images/image';
import ListReward from './ListReward';

type Props = {
  navigation: StackNavigationHelpers;
};

const RewardListScreen = ({ navigation }: Props) => {
  const { currentPoint, getCurrentPoint } = usePoint();
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
    <SafeAreaView style={styles.safeArea}>
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
              navigation.navigate('DetailPointScreen');
            }}>
            <LinearGradient
              colors={['#26A65C', '#41D981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.4, y: 0 }}
              style={styles.containerPoint}>
              <Image
                source={icons.ICKPoint}
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
                    fontFamily: font.AnuphanBold,
                    color: colors.white,
                  }}>
                  {numberWithCommas(currentPoint.toString(), true)}
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
              height: 64,
              flex: 0.48,
              borderWidth: 1,
              borderColor: colors.greenLight,
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
                height: '100%',
              }}>
              <View
                style={{
                  marginLeft: 16,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: font.AnuphanSemiBold,
                    color: colors.fontBlack,
                  }}>
                  รีวอร์ด
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: font.AnuphanSemiBold,
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
              fontSize: 22,
              fontFamily: font.AnuphanSemiBold,
              paddingHorizontal: 16,
              color: colors.fontBlack,
            }}>
            รางวัลทั้งหมด
          </Text>

          <ListReward navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RewardListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerPoint: {
    paddingHorizontal: 12,
    minHeight: 64,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  container: {},
});
