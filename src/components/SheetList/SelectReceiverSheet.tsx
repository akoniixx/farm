import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import React from 'react';
import { colors, font, icons } from '../../assets';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Text from '../Text/Text';
import { normalize } from '../../functions/Normalize';

interface Branch {
  createdAt: string;
  id: string;
  isActive: boolean;
  name: string;
  nameEn: string | null;
  updatedAt: string;
  shopCode: string;
}

const SelectReceiverSheet = (props: SheetProps) => {
  const { shopList } = props.payload;
  const [selectedArea, setSelectedArea] = React.useState<Branch | null>(null);
  const onPressConfirm = async () => {
    await SheetManager.hide(props.sheetId, {
      payload: {
        selected: selectedArea,
      },
    });
  };
  return (
    <ActionSheet
      closeOnTouchBackdrop={false}
      useBottomSafeAreaPadding={false}
      id={props.sheetId}
      containerStyle={{
        height: '80%',
      }}>
      <View style={styles().container}>
        <Text
          style={{
            fontFamily: font.AnuphanSemiBold,
            fontSize: 22,
          }}>
          เลือกร้านค้า
        </Text>
        <Text
          style={{
            fontFamily: font.SarabunMedium,
            fontSize: 14,
            color: colors.errorText,
            marginTop: 8,
          }}>
          เฉพาะเจ้าหน้าที่เท่านั้น
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingLeft: 16,
        }}
        data={shopList as Branch[]}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectedArea(item)}
              style={styles().list}>
              <Text
                style={{
                  fontFamily: font.SarabunMedium,
                  fontSize: normalize(18),
                }}>
                {item.name}
              </Text>
              {selectedArea?.shopCode === item.shopCode && (
                <Image
                  source={icons.correct}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />
      <View
        style={[
          styles().footer,
          {
            paddingHorizontal: 16,
            borderBottomWidth: 0,
          },
        ]}>
        <TouchableOpacity
          disabled={!selectedArea}
          style={
            styles({
              disable: !selectedArea,
            }).button
          }
          onPress={() => {
            onPressConfirm();
          }}>
          <Text style={styles().textButton}>ยืนยันการใช้</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles().subButton}
          onPress={async () => {
            await SheetManager.hide(props.sheetId, {
              payload: {
                selected: selectedArea,
                isCancel: true,
              },
            });
          }}>
          <Text style={styles().textSubButton}>ยกเลิก</Text>
        </TouchableOpacity>
        <View style={{ height: 8 }} />
      </View>
    </ActionSheet>
  );
};
const styles = (props?: any) =>
  StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      borderBottomWidth: 1,
      borderColor: colors.disable,
      paddingBottom: 8,
    },
    footer: {
      paddingVertical: 16,
      backgroundColor: colors.white,

      elevation: 8,
      shadowColor: '#242D35',
      shadowOffset: {
        width: 0,
        height: -8,
      },
      shadowOpacity: 0.04,
      shadowRadius: 16,
    },
    list: {
      width: '100%',
      paddingVertical: Platform.OS === 'android' ? 10 : 16,
      minHeight: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: colors.disable,
    },
    textButton: {
      fontSize: 20,
      fontFamily: font.AnuphanSemiBold,
      color: colors.white,
    },
    button: {
      width: '100%',
      backgroundColor: props?.disable ? colors.disable : colors.blueBorder,
      borderRadius: 8,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textSubButton: {
      fontSize: 20,
      fontFamily: font.AnuphanSemiBold,
      color: colors.fontBlack,
    },
    subButton: {
      width: '100%',
      backgroundColor: 'transparent',
      borderRadius: 8,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.grey40,
    },
  });
export default SelectReceiverSheet;
