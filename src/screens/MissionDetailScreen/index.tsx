import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import {SafeAreaView} from 'react-native-safe-area-context';
import CardDetail from './CardDetail';
import Text from '../../components/Text';
interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'MissionDetailScreen'>;
}

export default function MissionDetailScreen({navigation, route}: Props) {
  const {data} = route.params;
  const onPress = () => {
    navigation.navigate('RedeemAddressScreen', {
      missionData: {
        missionId: data.missionId,
        missionName: data.missionName,
        rewardName: data.reward.rewardName,
        amount: 1,
        step: data.num,
        imagePath: data.reward.imagePath,
      },
    });
  };

  console.log('data', JSON.stringify(data, null, 2));

  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader
        showBackBtn
        title={'รายละเอียดภารกิจ'}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View
            style={{
              flex: 1,
            }}>
            <CardDetail
              cardData={data.reward}
              current={data.current}
              dateEnd={data.endDate}
              total={data.total}
              missionName={data.missionName}
              disabled={data.isExpired}
            />
            {data.isComplete && !data.isStatusComplete && (
              <View
                style={{
                  marginVertical: 8,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 16,
                    color: colors.decreasePoint,
                  }}>
                  กรุณายืนยืนที่อยู่จัดส่ง เพื่อรับของรางวัล
                </Text>
              </View>
            )}

            <View
              style={{
                marginTop: 8,
                marginBottom: 16,
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                  color: colors.fontBlack,
                }}>
                รายละเอียด
              </Text>
              <Text
                style={{
                  fontFamily: font.light,
                  color: colors.gray,
                }}>
                {data.descriptionReward}
              </Text>
            </View>
            <View
              style={{
                marginTop: 8,
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                  color: colors.fontBlack,
                }}>
                เงื่อนไข
              </Text>
              <Text
                style={{
                  fontFamily: font.light,
                  color: colors.gray,
                }}>
                {data.conditionReward}
              </Text>
            </View>
          </View>
          {data.isComplete && !data.isStatusComplete && (
            <View
              style={{
                padding: 16,
              }}>
              <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.textButton}>ยืนยันการแลก</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  footer: {
    height: 100,
    backgroundColor: colors.white,

    flexDirection: 'row',
    padding: 16,
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
  },
});
