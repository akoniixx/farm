import {normalize} from '@rneui/themed';
import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import MainTaskTapNavigator from '../../navigations/topTabs/MainTaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';

const MainTaskScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: normalize(20),
          backgroundColor: colors.white,
        }}>
        <Text style={{fontFamily: font.bold, fontSize: normalize(19)}}>
          งานของฉัน
        </Text>
      </View>
      <MainTaskTapNavigator />
    </View>
  );
};
export default MainTaskScreen;
