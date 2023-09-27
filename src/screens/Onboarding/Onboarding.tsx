import { View, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { normalize } from '../../functions/Normalize';
import { MainButton } from '../../components/Button/MainButton';
import HomeCarousel from '../../components/Carousel/HomeCarousel';
import { colors, font } from '../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
const mappingStep = {
  0: {
    title: 'ถัดไป',
    icon: '',
  },
  1: {
    title: 'ถัดไป',
    icon: '',
  },
  2: {
    title: 'เริ่มใช้งาน',
    icon: '',
  },
};

const Onboarding: React.FC<any> = ({ navigation }) => {
  const [step, setStep] = React.useState<number>(0);
  const ref = React.createRef<any>();

  const onPressNext = async (index: number) => {
    if (index === 2) {
      navigation.navigate('HomeScreen');
      await AsyncStorage.setItem('onBoarding', 'true');
    } else {
      if (ref.current) {
        ref.current.next();
      }
      setStep(index + 1);
    }
  };
  const onSnapToItem = (index: number) => {
    setStep(index);
  };
  return (
    <SafeAreaView style={stylesCentral.container}>
      <View style={styles.inner}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <HomeCarousel step={step} onSnapToItem={onSnapToItem} ref={ref} />
        </View>
        <View>
          <MainButton
            label={mappingStep[step as keyof typeof mappingStep].title}
            color={colors.greenLight}
            onPress={() => {
              onPressNext(step);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Onboarding;

const styles = StyleSheet.create({
  btnContainer: {
    width: normalize(343),
    height: normalize(54),
    marginVertical: normalize(10),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
});
