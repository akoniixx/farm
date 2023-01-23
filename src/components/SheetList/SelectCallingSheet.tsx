import { View, StyleSheet, Image, Text } from 'react-native';
import React from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import icons from '../../assets/icons/icons';
import fonts from '../../assets/fonts';
import { MainButton } from '../Button/MainButton';
import colors from '../../assets/colors/colors';
import { callcenterNumber } from '../../definitions/callCenterNumber';

export default function SelectCallingSheet(props: SheetProps) {
  const telDroner = '0812345678';
  const telOfficer = callcenterNumber;
  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        height: '28%',
      }}>
      <View style={styles.container}>
        <View
          style={{
            marginTop: 8,
            height: 5,
            borderRadius: 10,
            width: 50,
            backgroundColor: '#EBEEF0',
            marginBottom: 8,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            marginTop: 8,
          }}>
          <Image
            source={icons.callingBlack}
            style={{
              width: 20,
              marginRight: 8,
              height: 20,
            }}
          />
          <Text
            style={{
              fontFamily: fonts.AnuphanMedium,
              fontSize: 20,
            }}>
            โทรศัพท์หา
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            width: '100%',
          }}>
          <MainButton
            color={colors.blueBorder}
            borderColor={colors.blueBorder}
            label="เจ้าหน้าที่"
            onPress={async () => {
              await SheetManager.hide(props.sheetId, { payload: telOfficer });
            }}
            fontColor={colors.white}
            style={{
              height: 52,
            }}
          />
          <MainButton
            style={{
              height: 52,
              marginVertical: 0,
            }}
            onPress={async () => {
              await SheetManager.hide(props.sheetId, { payload: telDroner });
            }}
            color={colors.white}
            borderColor={'#202326'}
            label="นักบินโดรน"
            fontColor={colors.fontBlack}
          />
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
