import {View} from 'react-native';
import React from 'react';
import ActionSheet, {SheetProps} from 'react-native-actions-sheet';
import Text from '../Text';

export default function SheetComment({sheetId, payload}: SheetProps) {
  console.log('payload', payload);
  return (
    <ActionSheet
      useBottomSafeAreaPadding={false}
      id={sheetId}
      containerStyle={{
        height: '90%',
      }}>
      <View>
        <Text>Comment</Text>
      </View>
    </ActionSheet>
  );
}
