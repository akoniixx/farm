import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import HomeCarousel from '../../components/Carousel/HomeCarousel';
import {MainButton} from '../../components/Button/MainButton';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';

const HomeScreen: React.FC<any> = ({navigation}) => {
  return (
    <SafeAreaView style={stylesCentral.container}>
      <View style={styles.inner}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <HomeCarousel />
        </View>
        <View>
          <MainButton
            label="เข้าสู่ระบบ"
            color={colors.orange}
            onPress={() => navigation.navigate('LoginScreen')}
          />

          <MainButton
            label="ลงทะเบียนนักบินโดรน"
            color={colors.white}
            fontColor={'black'}
            onPress={() => navigation.navigate('ConditionScreen')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: normalize(343),
    marginVertical: normalize(10),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
});
