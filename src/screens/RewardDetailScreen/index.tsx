import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {colors} from '../../assets';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import CustomHeader from '../../components/CustomHeader';
import {numberWithCommas} from '../../function/utility';
import mockImage from '../../assets/mockImage';
import {normalize} from '@rneui/themed';
interface Props {
  navigation: StackNavigationHelpers;
  route: RouteProp<StackParamList, 'RewardDetailScreen'>;
}
export default function RewardDetailScreen({navigation, route}: Props) {
  const currentPoint = 123000;
  const width = useWindowDimensions().width - 32;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() => navigation.goBack()}
        title={`${numberWithCommas(currentPoint.toString(), true)} คะแนน`}
      />
      <View
        style={{
          paddingHorizontal: 16,
        }}>
        <Image
          source={mockImage.reward1}
          style={{
            height: width,
            width: width,
            borderRadius: 12,
          }}
        />
      </View>
      <View style={styles.container}>
        <Text>เสื้อไอคอนเกษตกร 2 ตัว มูลค่า 1,000 บาท</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
