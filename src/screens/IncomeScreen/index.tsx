import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../assets';
import fonts from '../../assets/fonts';
import CardIncomeList from '../../components/CardIncomeList';
import {normalize} from '../../function/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';
import ContentList from './ContentList';

const IncomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: normalize(20),
          backgroundColor: colors.white,
        }}>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: normalize(19),
            color: colors.fontBlack,
          }}>
          รายได้
        </Text>
      </View>
      <View>
        <CardIncomeList />
      </View>
      <ContentList />
    </View>
  );
};
export default IncomeScreen;
