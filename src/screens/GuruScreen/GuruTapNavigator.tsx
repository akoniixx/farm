import {Image, StyleSheet} from 'react-native';
import React from 'react';

import fonts from '../../assets/fonts';
import TabSelector from '../../components/TabCustom/TabCustom';
import {colors} from '../../assets';

interface Props {
  value: string;
  onChange: (value: string) => void;
}
const tabs = [
  {value: 'all', title: 'ทั้งหมด'},
  {value: 'video', title: 'วิดีโอ'},
  {value: 'article', title: 'บทความ'},
];
export default function GuruTapNavigator({value, onChange}: Props) {
  return (
    <TabSelector
      onChangeTab={onChange}
      tabs={tabs}
      value={value}
      focusColor={colors.orange}
      scrollViewStyle={{marginTop: 8, paddingVertical: 0, paddingTop: 8}}
      color={colors.grey2}
      fontSize={20}
      tabWidth={88}
      fontFamily={fonts.semiBold}
    />
  );
}

// const styles = StyleSheet.create({
//   label: {
//     fontFamily: fonts.bold,
//     fontSize: 16,
//   },
// });
