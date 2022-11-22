import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {colors, font} from '../../assets';

const MyDatePicker = () => {
  
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear() +543;
  
  const buddhist = new Date(year, month, day);

  return (
    <>
      <DatePicker
        textColor={colors.fontBlack}
        date={buddhist}
        maximumDate={buddhist}
        mode='date'
      />
    </>
  );
};
export default MyDatePicker;
