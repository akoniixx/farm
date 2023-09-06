import { View } from 'react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import colors from '../../assets/colors/colors';

export default function LoadingPagination() {
  return (
    <View
      style={{
        marginTop: 16,
      }}>
      <ActivityIndicator size={'large'} color={colors.greenLight} />
    </View>
  );
}
