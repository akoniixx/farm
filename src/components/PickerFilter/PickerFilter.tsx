import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Picker, onClose } from 'react-native-actions-sheet-picker';
import { font, image } from '../../assets';
import { normalize } from '../../functions/Normalize';
import colors from '../../assets/colors/colors';
import Text from '../Text/Text';

interface Props {
  id: string;
  data: {
    name: string;
    value: string;
  }[];
  title?: string;
  setSelected: (value: any) => void;
  height?: number;
  selected?: any;
}
export default function PickerFilter({
  id,
  data,
  title,
  setSelected,
  height = 300,
  selected,
}: Props) {
  return (
    <Picker
      id={id}
      data={data}
      actionsSheetProps={{
        children: <View />,
        containerStyle: {
          height,
          borderRadius: 20,
          padding: 0,
        },
      }}
      flatListProps={{
        contentContainerStyle: {
          paddingHorizontal: 0,
        },
        ListHeaderComponent: () => {
          return (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: 40,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(20),
                  }}>
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    onClose(id);
                  }}>
                  <Text
                    style={{
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(20),
                      color: colors.greenLight,
                    }}>
                    ยกเลิก
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
            </>
          );
        },
        data: data,
        keyExtractor: (item, index) => index.toString(),
        renderItem: ({ item }) => {
          return (
            <View
              style={{
                paddingLeft: 20,
              }}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  onClose(id);
                  setSelected(item);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingRight: 20,
                  }}>
                  <Text
                    style={{
                      fontFamily: font.SarabunLight,
                      fontSize: normalize(20),
                      color: colors.fontBlack,
                    }}>
                    {item.name}
                  </Text>
                  {selected && selected.name === item.name && (
                    <Image
                      source={image.checked}
                      style={{
                        width: normalize(24),
                        height: normalize(24),
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.separator} />
            </View>
          );
        },
      }}
      setSelected={setSelected}
    />
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.disable,
    width: '100%',
  },
});
