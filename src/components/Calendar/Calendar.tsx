import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {LocaleConfig, Calendar} from 'react-native-calendars';
import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import colors from '../../assets/colors/colors';
import {normalize} from '@rneui/themed';
import {font} from '../../assets';
import {
  CalendarReducer,
  CalendarMode,
  _monthNumber,
  build12Year,
  _monthName,
  buildDate,
} from '../../hooks/calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {print} from '@gorhom/bottom-sheet/lib/typescript/utilities/logger';

LocaleConfig.locales.th = {
  monthNames: [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ],
  monthNamesShort: [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ],
  dayNames: [
    'อาทิตย์',
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัสบดี',
    'ศุกร์',
    'เสาร์',
  ],
  dayNamesShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
};
LocaleConfig.defaultLocale = 'th';
const date = new Date();

interface CalendarType {
  dateCurrent: string;
  mode: CalendarMode;
  monthCurrent: number;
  yearCurrent: number;
  yearArray: number[];
  monthNumber: string[];
  monthArray: string[];
  highlight: boolean;
}

interface CalendarCustomType {
  onHandleChange: (value: any) => void;
  value: string;
}

const CalendarCustom: React.FC<CalendarCustomType> = ({
  onHandleChange,
  value,
}) => {
  const dateSplit = value.split('-');
  const initCurrentCalendar = {
    dateCurrent:
      value != ''
        ? value
        : `${date.getFullYear()}-${_monthNumber[date.getMonth()]}-${buildDate(
            date.getDate(),
          )}`,
    mode: CalendarMode.Calendar,
    monthCurrent: value != '' ? parseInt(dateSplit[1]) - 1 : date.getMonth(),
    yearCurrent: value != '' ? parseInt(dateSplit[0]) : date.getFullYear(),
    yearArray:
      value != ''
        ? build12Year(parseInt(dateSplit[0]))
        : build12Year(date.getFullYear()),
    monthNumber: _monthNumber,
    monthArray: _monthName,
    highlight: true,
  };
  const width = Dimensions.get('window').width;
  const [calendarState, dispatch] = useReducer(
    CalendarReducer,
    initCurrentCalendar,
  );
  switch (calendarState.mode) {
    case CalendarMode.Calendar:
      return (
        <Calendar
          onPressArrowLeft={() =>
            dispatch({
              type: 'ArrowLeft',
            })
          }
          onPressArrowRight={() => {
            if (
              !(
                parseInt(calendarState.dateCurrent.split('-')[1]) ===
                  date.getMonth() + 1 &&
                parseInt(calendarState.dateCurrent.split('-')[0]) ===
                  date.getFullYear()
              )
            ) {
              dispatch({
                type: 'ArrowRight',
              });
            }
          }}
          initialDate={calendarState.dateCurrent}
          markingType={'custom'}
          markedDates={{
            [calendarState.dateCurrent]: {
              customStyles: {
                container: {
                  backgroundColor: calendarState.highlight
                    ? colors.orange
                    : colors.white,
                },
                text: {
                  color: calendarState.highlight
                    ? colors.white
                    : colors.fontBlack,
                },
              },
            },
          }}
          renderHeader={date => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() =>
                  dispatch({
                    type: 'ChangeMode',
                    mode: CalendarMode.Month,
                  })
                }>
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                  }}>
                  {calendarState.monthArray[calendarState.monthCurrent]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  dispatch({
                    type: 'ChangeMode',
                    mode: CalendarMode.Year,
                  })
                }>
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: normalize(18),
                    paddingLeft: normalize(10),
                    color: colors.fontBlack,
                  }}>{`${calendarState.yearCurrent + 543}`}</Text>
              </TouchableOpacity>
            </View>
          )}
          theme={{
            arrowColor: colors.orange,
            textDayFontFamily: font.bold,
            textMonthFontFamily: font.medium,
            textDayHeaderFontFamily: font.medium,
            selectedDayBackgroundColor: colors.orange,
            selectedDayTextColor: colors.white,
          }}
          onDayPress={day => {
            console.log(day.dateString);
            if (
              !(
                parseInt(day.dateString.split('-')[2]) > date.getDate() &&
                parseInt(day.dateString.split('-')[1]) ===
                  date.getMonth() + 1 &&
                parseInt(day.dateString.split('-')[0]) === date.getFullYear()
              )
            ) {
              dispatch({
                type: 'ChangeDate',
                date: day.dateString,
              });
              onHandleChange(day);
            }
          }}
        />
      );
    case CalendarMode.Month:
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            paddingVertical: normalize(10),
          }}>
          {calendarState.monthArray.map((item: any, index: number) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                dispatch({
                  type: 'ChangeMonth',
                  month: index,
                });
              }}
              style={{
                paddingVertical: normalize(10),
              }}>
              <View
                style={{
                  width: width / 4.2,
                  height: normalize(30),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    calendarState.monthCurrent === index
                      ? colors.white
                      : colors.orange,
                  borderRadius: normalize(4),
                }}>
                <Text
                  style={{
                    fontFamily: font.medium,
                    color:
                      calendarState.monthCurrent === index
                        ? colors.fontBlack
                        : colors.white,
                  }}>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );

    case CalendarMode.Year:
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                dispatch({
                  type: 'ChangeRangeArrowLeftYear',
                });
              }}>
              <Text
                style={{
                  fontSize: normalize(24),
                  color: colors.orange,
                }}>{`<`}</Text>
            </TouchableOpacity>
            <Text>
              {`${calendarState.yearArray[0] + 543} - ${
                calendarState.yearArray[11] + 543
              }`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (calendarState.yearArray[11] < date.getFullYear()) {
                  dispatch({
                    type: 'ChangeRangeArrowRightYear',
                  });
                }
              }}>
              <Text
                style={{
                  fontSize: normalize(24),
                  color: colors.orange,
                }}>{`>`}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingVertical: normalize(10),
            }}>
            {calendarState.yearArray.map((item: any) =>
              item <= date.getFullYear() ? (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    dispatch({
                      type: 'ChangeYear',
                      year: item,
                    });
                  }}
                  style={{
                    paddingVertical: normalize(10),
                  }}>
                  <View
                    style={{
                      width: width / 4.2,
                      height: normalize(30),
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:
                        calendarState.yearCurrent === item
                          ? colors.white
                          : colors.orange,
                      borderRadius: normalize(4),
                    }}>
                    <Text
                      style={{
                        fontFamily: font.medium,
                        color:
                          calendarState.yearCurrent === item
                            ? colors.fontBlack
                            : colors.white,
                      }}>
                      {item + 543}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              ),
            )}
          </View>
        </View>
      );
    default:
      return (
        <Calendar
          onPressArrowLeft={() =>
            dispatch({
              type: 'ArrowLeft',
            })
          }
          onPressArrowRight={() =>
            dispatch({
              type: 'ArrowRight',
            })
          }
          initialDate={calendarState.dateCurrent}
          markingType={'custom'}
          markedDates={{
            [calendarState.dateCurrent]: {
              customStyles: {
                container: {
                  backgroundColor: calendarState.highlight
                    ? colors.orange
                    : colors.white,
                },
                text: {
                  color: calendarState.highlight
                    ? colors.white
                    : colors.fontBlack,
                },
              },
            },
          }}
          renderHeader={date => (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() =>
                  dispatch({
                    type: 'ChangeMode',
                    mode: CalendarMode.Month,
                  })
                }>
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: normalize(18),
                  }}>
                  {calendarState.monthArray[calendarState.monthCurrent]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  dispatch({
                    type: 'ChangeMode',
                    mode: CalendarMode.Year,
                  })
                }>
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: normalize(18),
                    paddingLeft: normalize(10),
                  }}>{`${calendarState.yearCurrent + 543}`}</Text>
              </TouchableOpacity>
            </View>
          )}
          theme={{
            arrowColor: colors.orange,
            textDayFontFamily: font.bold,
            textMonthFontFamily: font.medium,
            textDayHeaderFontFamily: font.medium,
            selectedDayBackgroundColor: colors.orange,
            selectedDayTextColor: colors.white,
          }}
          onDayPress={day => {
            dispatch({
              type: 'ChangeDate',
              date: day.dateString,
            });
            onHandleChange(day);
          }}
        />
      );
  }
};

export default CalendarCustom;
