import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import { dialCall } from '../../functions/utility';
import { MainButton } from '../Button/MainButton';
import Text from '../Text/Text';

export const CallingModal = (props: SheetProps<{ tel: string }>) => {
  return (
    <ActionSheet
      containerStyle={{
        height: normalize(300),
      }}
      id={props.sheetId}
      useBottomSafeAreaPadding
      gestureEnabled={true}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.h1}>โทรศัพท์หา</Text>
        </View>
        <MainButton
          label={'เจ้าหน้าที่'}
          color={'#32AFFB'}
          onPress={() => dialCall()}
        />
        <MainButton
          label={'นักบินโดรน'}
          color={colors.white}
          fontColor={'black'}
          borderColor={colors.disable}
          onPress={() => dialCall(props.payload?.tel)}
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
    fontFamily: fonts.AnuphanMedium,
    colors: 'black',
    fontSize: normalize(19),
  },
});
