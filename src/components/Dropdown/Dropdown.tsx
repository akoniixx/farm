/* eslint-disable @typescript-eslint/no-shadow */
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';
import DropDownPicker from 'react-native-dropdown-picker';
import fonts from '../../assets/fonts';

interface Props {
  onChange: any;
  placeholder?: string;
  items: {
    label: string;
    value: string;
  }[];
  value: string;
}
export default function Dropdown({onChange, placeholder, items, value}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropDownPicker
      disabled={items.length === 0}
      listMode="SCROLLVIEW"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      textStyle={{
        fontFamily: font.medium,
        fontSize: 16,
      }}
      zIndex={3000}
      zIndexInverse={3000}
      style={{
        borderWidth: 1,
        borderColor: colors.grey3,
        borderRadius: 5,
        paddingHorizontal: 16,
        minHeight: 56,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 16,
        zIndex: 3001,
      }}
      placeholder={placeholder}
      placeholderStyle={{
        color: colors.grey2,
        fontFamily: font.light,
        fontSize: 16,
      }}
      containerStyle={{
        zIndex: 3001,
      }}
      renderListItem={({label, value}) => (
        <TouchableOpacity
          style={{height: 40, paddingHorizontal: 16}}
          onPress={() => {
            setOpen(false);
            onChange({
              label,
              value,
            });
          }}>
          <Text style={{fontFamily: fonts.medium}}>{label}</Text>
        </TouchableOpacity>
      )}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={onChange}
      dropDownDirection="BOTTOM"
      dropDownContainerStyle={
        Platform.OS === 'ios'
          ? {
              borderColor: colors.disable,
              zIndex: 3001,

              backgroundColor: colors.white,
            }
          : {
              position: 'relative',
              top: 0,
              borderColor: colors.disable,
              zIndex: 3001,

              backgroundColor: colors.white,
            }
      }
    />
  );
}
