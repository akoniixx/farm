import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {normalize} from '../../function/Normalize';
import {font} from '../../assets';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
// import DatePicker from 'react-native-modern-datepicker';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

interface Props {
  onChange?: (date: Date) => void;
  value?: Date;
}
const InputTime = ({onChange, value}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <View
        style={{
          width: '100%',
          alignItems: 'flex-start',
          marginTop: 10,
          marginBottom: 8,
        }}>
        <Text
          style={{
            fontFamily: font.medium,
            fontSize: normalize(16),
            color: colors.fontBlack,
          }}>
          เวลาเสร็จสิ้นการพ่น
        </Text>
      </View>
      <TouchableOpacity
        style={{
          width: '100%',
          padding: normalize(5),
          paddingVertical: normalize(7),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.grayPlaceholder,
        }}
        onPress={() => setIsOpen(true)}>
        {!value ? (
          <Text
            style={{
              fontFamily: font.medium,

              fontSize: normalize(16),
              color: colors.grayPlaceholder,
            }}>
            เลือกเวลา
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: font.medium,

              fontSize: normalize(16),
              color: colors.inputText,
            }}>
            {value ? dayjs(value).format('HH:mm') : ''}
          </Text>
        )}
        <Image
          source={icons.timeIcon}
          style={{
            width: normalize(25),
            height: normalize(25),
          }}
        />
      </TouchableOpacity>
      {/* <DatePicker
        mode="time"
        options={{
          headerFont: font.medium,
        }}
      /> */}
      <DateTimePickerModal
        isVisible={isOpen}
        mode="time"
        cancelTextIOS="ยกเลิก"
        is24Hour
        locale="th"
        confirmTextIOS="ตกลง"
        timePickerModeAndroid="spinner"
        onCancel={() => setIsOpen(false)}
        onConfirm={date => {
          onChange?.(date);
          setIsOpen(false);
        }}
      />
    </>
  );
};

export default InputTime;
