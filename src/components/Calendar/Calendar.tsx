import moment from 'moment';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors, font } from '../../assets';
import { _monthName, build12Year } from '../../definitions/constants';
import { normalize } from '../../functions/Normalize';
import { MainButton } from '../Button/MainButton';

const DatePickerCustom: React.FC<DatePickerProps> = ({
  value,
  onHandleChange,
  height,
  width,
  fontSize,
  textColor,
  startYear,
  endYear,
  markColor,
  markHeight,
  markWidth,
  fadeColor,
  format,
}) => {
  const [days, setDays] = useState<any[]>([]);
  const [months, setMonths] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);

  useEffect(() => {
    const getInitDate = () => {
      const end = endYear || new Date().getFullYear() + 543;
      const start = !startYear || startYear > end ? end - 70 : startYear;

      const _days = [...Array(moment(value).daysInMonth())].map(
        (_, index) => index + 1,
      );
      const _months = [...Array(12)].map((_, i) => i + 1);
      const _years = [...Array(end - start + 1)].map(
        (_, index) => start + index,
      );

      setDays(_days);
      setMonths(_months);
      setYears(_years);
    };
    getInitDate();
  }, [startYear, endYear]);

  const pickerHeight: number = Math.round(
    height || Dimensions.get('window').height / 3.5,
  );
  const pickerWidth: number | string = width || '100%';

  const unexpectedDate: Date = new Date(years[0], 0, 0);
  const date = new Date(value || unexpectedDate);

  // const date = new Date()

  const changeHandle = (type: any, digit: any): void => {
    switch (type) {
      case 'day':
        date.setDate(digit);
      case 'month':
        date.setMonth(digit - 1);
      case 'year':
        date.setFullYear(digit - 543);
    }
    onHandleChange(date);
  };

  const getOrder = () => {
    return (format || 'dd-mm-yyyy').split('-').map((type, index: any) => {
      switch (type) {
        case 'dd':
          return { name: 'day', digits: days, value: date.getDay() };
        case 'mm':
          return { name: 'month', digits: months, value: date.getMonth() + 1 };
        case 'yyyy':
          return { name: 'year', digits: years, value: date.getFullYear() };
        default:
          console.warn(
            `Invalid date picker format prop: found "${type}" in ${format}. Please read documentation!`,
          );
          return {
            name: ['day', 'month', 'year'][index],
            digits: [days, months, years][index],
            value: [date.getDate(), date.getMonth() + 1, date.getFullYear()][
              index
            ],
          };
      }
    });
  };
  return (
    <View style={[styles.picker, { height: pickerHeight, width: pickerWidth }]}>
      {getOrder().map((el, index) => {
        if (index == 2) {
          return (
            <DateBlock
              index={2}
              digits={el.digits}
              value={el.value}
              onHandleChange={changeHandle}
              height={pickerHeight}
              fontSize={fontSize}
              textColor={textColor}
              markColor={markColor}
              markHeight={markHeight}
              markWidth={markWidth}
              fadeColor={fadeColor}
              type={el.name}
              key={index}
            />
          );
        } else {
          return (
            <DateBlock
              index={index}
              digits={el.digits}
              value={el.value}
              onHandleChange={changeHandle}
              height={pickerHeight}
              fontSize={fontSize}
              textColor={textColor}
              markColor={markColor}
              markHeight={markHeight}
              markWidth={markWidth}
              fadeColor={fadeColor}
              type={el.name}
              key={index}
            />
          );
        }
      })}
    </View>
  );
};

const DateBlock: React.FC<DateBlockProps> = ({
  index,
  value,
  digits,
  type,
  onHandleChange,
  height,
  fontSize,
  textColor,
  markColor,
  markHeight,
  markWidth,
  fadeColor,
}) => {
  const dHeight: number = Math.round(height / 4);

  const mHeight: number = markHeight || Math.min(dHeight, 65);
  const mWidth: number | string = markWidth || '70%';
  const offsets = digits.map((_: number, index: number) => index * dHeight);
  const scrollRef = useRef<any>(null);
  const snapScrollToIndex = (index: number) => {
    scrollRef?.current?.scrollTo({ y: dHeight * index, animated: false });
  };
  useEffect(() => {
    snapScrollToIndex(value - digits[6]);
  }, []);

  const handleMomentumScrollEnd = ({ nativeEvent }: any) => {
    const digit = Math.round(nativeEvent.contentOffset.y / dHeight + digits[0]);
    onHandleChange(type, digit);
  };

  return (
    <View style={styles.block}>
      <View
        style={[
          styles.mark,
          {
            top: (height - mHeight) / 2,
            height: mHeight,
            width: normalize(130),
          },
        ]}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        snapToOffsets={offsets}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={0}
        onMomentumScrollEnd={handleMomentumScrollEnd}>
        {digits.map((value: any, valIndex: any) => {
          return (
            <TouchableOpacity
              key={valIndex}
              onPress={() => {
                onHandleChange(type, digits[valIndex]);
                snapScrollToIndex(valIndex);
              }}>
              <Text
                style={[
                  styles.digit,
                  {
                    fontSize: fontSize || 20,
                    color: textColor || '#000000',
                    marginBottom:
                      valIndex === digits.length - 1
                        ? height / 2 - dHeight / 2
                        : 0,
                    marginTop: valIndex === 0 ? height / 2 - dHeight / 2 : 0,
                    lineHeight: dHeight,
                    height: dHeight,
                    fontFamily: font.AnuphanMedium,
                  },
                ]}>
                {index !== 1 ? value : _monthName[valIndex].value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    width: '100%',
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  scroll: {
    width: '100%',
  },
  digit: {
    fontSize: 20,
    textAlign: 'center',
  },
  mark: {
    position: 'absolute',
    borderRadius: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: colors.disable,
    borderTopColor: colors.disable,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
  },
});

export interface DatePickerProps {
  value: any;
  height?: number;
  width?: number | string;
  fontSize?: number;
  textColor?: string;
  startYear?: number;
  endYear?: number;
  markColor?: string;
  markHeight?: number;
  markWidth?: number | string;
  fadeColor?: string;
  format?: string;
  onHandleChange: (value: any) => void;
  isCurrentDate?: boolean;
}

export interface DateBlockProps {
  index: number;
  digits: any[];
  value: any;
  type: string;
  height: number;
  fontSize?: number;
  textColor?: string;
  markColor?: string;
  markHeight?: number;
  markWidth?: number | string;
  fadeColor?: string;
  onHandleChange(type: any, digit: any): void;
}

export default DatePickerCustom;
