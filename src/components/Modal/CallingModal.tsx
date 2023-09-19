import React from 'react';
import {View, StyleSheet} from 'react-native';
import {normalize} from '@rneui/themed';
import {MainButton} from '../Button/MainButton';
import {colors} from '../../assets';
import {dialCall} from '../../function/utility';
import ActionSheet, {SheetProps} from 'react-native-actions-sheet';
import fonts from '../../assets/fonts';
import Text from '../Text';

export const CallingModal = (props: SheetProps<{tel: string}>) => {
  return (
    <ActionSheet
      containerStyle={{
        height: normalize(300),
      }}
      id={props.sheetId}
      useBottomSafeAreaPadding
      gestureEnabled={true}>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.h1}>โทรศัพท์หา</Text>
        </View>
        <MainButton
          label={'เกษตรกร'}
          color={colors.orange}
          onPress={() => dialCall(props.payload?.tel)}
        />
        <MainButton
          label={'ติดต่อเจ้าหน้าที่'}
          color={colors.white}
          fontColor={'red'}
          borderColor={colors.disable}
          onPress={() => dialCall()}
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(15),
  },
  h1: {
    fontFamily: fonts.medium,
    colors: 'black',
    fontSize: normalize(19),
  },
});
