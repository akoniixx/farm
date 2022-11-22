import {View,StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import { normalize } from '../../functions/Normalize';
import { MainButton } from '../../components/Button/MainButton';
import HomeCarousel from '../../components/Carousel/HomeCarousel';
import {colors, font} from '../../assets';

const HomeScreen: React.FC<any> = ({navigation}) => {
  return (
    <SafeAreaView style={stylesCentral.container}>
      <View style={styles.inner}>
        <View style={{flex: 1,alignItems:'center'}}>
          <HomeCarousel />
        </View>
        <View>
          <MainButton
            label="เริ่มใช้งาน"
            color={colors.greenLight}
            onPress={() => navigation.navigate('MainScreen')}
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
