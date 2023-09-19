import {View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {normalize} from '../../function/Normalize';
import {font} from '../../assets';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
// import DatePicker from 'react-native-modern-datepicker';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import Text from '../Text';

interface Props {
  onChange?: (date: Date) => void;
  value?: Date;
  label?: string;
  placeholder?: string;
}
const InputTime = ({
  onChange,
  value,
  label,
  placeholder = 'เลือกเวลา',
}: Props): JSX.Element => {
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
        {label && (
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: normalize(16),
              color: colors.fontBlack,
            }}>
            {label}
          </Text>
        )}
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
            {placeholder}
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
      {/* {isOpen && (
        <Modal isVisible={isOpen}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'relative',
              top: 32,
              right: 24,
              zIndex: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
              }}
              style={{
                padding: 4,
              }}>
              <Image
                source={icons.closeBlack}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            </TouchableOpacity>
          </View>
          <DatePicker
            mode="time"
            style={{
              borderRadius: 12,
            }}
            onTimeChange={e => {
              onChange?.(e);
              setIsOpen(false);
            }}
            options={{
              defaultFont: font.medium,
              mainColor: colors.orange,
              headerFont: font.medium,
            }}
            selected={value}
          />
        </Modal>
      )} */}
    </>
  );
};

export default InputTime;
