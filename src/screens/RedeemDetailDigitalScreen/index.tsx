import {View, Text} from 'react-native';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'RedeemDetailDigitalScreen'>;
}

export default function RedeemDetailDigitalScreen({navigation, route}: Props) {
  return (
    <View>
      <Text>RedeemDetailDigitalScreen</Text>
    </View>
  );
}
