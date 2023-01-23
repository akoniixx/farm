import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { font } from '../../assets';
import colors from '../../assets/colors/colors';

interface Prop {
  hour: number;
  minute: number;
  setHour: (h: number) => void;
  setMinute: (m: number) => void;
}

const TimePicker: React.FC<Prop> = ({ setHour, setMinute, hour, minute }) => {
  const scrollRefHour = useRef<any>(null);
  const scrollRefMinute = useRef<any>(null);
  const height = 170;
  const dHeight = height / 3;
  const pickerHeight: number = Math.round(
    height || Dimensions.get('window').height / 3.5,
  );
  const mHeight: number = Math.min(dHeight + 20, 65);

  const { hourList, minuteList } = useMemo(() => {
    const hourList = Array.from({ length: 24 }, (_, i) => i);

    const minuteList = Array.from({ length: 60 }, (_, i) => i);
    return {
      hourList,
      minuteList,
    };
  }, []);
  const handleMomentumScrollEndHour = ({ nativeEvent }: any) => {
    const contentOffset = nativeEvent.contentOffset;
    const viewSize = nativeEvent.layoutMeasurement;

    const currentNumber = Math.round(contentOffset.y / viewSize.height);
    if (currentNumber === 0) {
      setHour(0);
    } else {
      const digit = Math.round(
        nativeEvent.contentOffset.y / dHeight + hourList[0],
      );
      setHour(digit);
    }
  };

  const handleMomentumScrollEndMinute = ({ nativeEvent }: any) => {
    const contentOffset = nativeEvent.contentOffset;
    const viewSize = nativeEvent.layoutMeasurement;

    const currentNumber = Math.round(contentOffset.y / viewSize.height);
    if (currentNumber === 0) {
      setMinute(0);
    } else {
      const digit = Math.round(
        nativeEvent.contentOffset.y / dHeight + minuteList[0],
      );
      setMinute(digit);
    }
  };
  const snapScrollToIndexHour = (index: number) => {
    scrollRefHour?.current?.scrollTo?.({ y: dHeight * index, animated: true });
  };
  const snapScrollToIndexMinute = (index: number) => {
    scrollRefMinute?.current?.scrollTo?.({
      y: dHeight * index,
      animated: true,
    });
  };
  useEffect(() => {
    setTimeout(() => {
      if (hour && scrollRefHour) {
        const findIndex = hourList.findIndex(item => item === hour);

        snapScrollToIndexHour(findIndex);
      }
      if (minute && scrollRefMinute) {
        const findIndex = minuteList.findIndex(item => item === minute);
        snapScrollToIndexMinute(findIndex);
      }
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRefHour, scrollRefMinute]);
  return (
    <View style={styles.block}>
      <View
        style={[
          styles.mark,
          {
            top: (height - mHeight) / 2,
            height: mHeight,
            width: '100%',
          },
        ]}
      />
      <View
        style={{
          height: pickerHeight,
        }}>
        <ScrollView
          ref={scrollRefHour}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.scroll}
          pagingEnabled
          onMomentumScrollEnd={handleMomentumScrollEndHour}>
          {hourList.map((value: any, valIndex: any) => {
            const isLast = valIndex === hourList.length - 1;
            return (
              <TouchableOpacity
                key={valIndex}
                style={{
                  width: 50,

                  opacity: valIndex === hour ? 1 : 0.3,
                }}
                onPress={() => {
                  // onHandleChange(type, digits[valIndex]);
                  setHour(valIndex);
                  snapScrollToIndexHour(valIndex);
                }}>
                <Text
                  style={[
                    {
                      color: colors.fontBlack,
                      lineHeight: dHeight,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: isLast ? height / 2 - dHeight / 2 : 0,
                      marginTop: valIndex === 0 ? height / 2 - dHeight / 2 : 0,
                      fontWeight: valIndex === hour ? '700' : '400',
                      fontFamily: font.AnuphanMedium,
                      fontSize: 20,
                    },
                  ]}>
                  {valIndex < 10 ? `0${valIndex}` : valIndex}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: pickerHeight,
        }}>
        <Text
          style={{
            fontFamily: font.AnuphanMedium,
          }}>
          :
        </Text>
      </View>
      <View
        style={{
          height: pickerHeight,
        }}>
        <ScrollView
          pagingEnabled
          ref={scrollRefMinute}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEndMinute}>
          {minuteList.map((value: any, valIndex: any) => {
            const isLast = valIndex === minuteList.length - 1;
            return (
              <TouchableOpacity
                style={{
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: isLast ? height / 2 - dHeight / 2 : 0,
                  marginTop: valIndex === 0 ? height / 2 - dHeight / 2 : 0,
                  opacity: valIndex === minute ? 1 : 0.3,
                }}
                onPress={() => {
                  setMinute(valIndex);
                  snapScrollToIndexMinute(valIndex);
                }}>
                <Text
                  style={[
                    {
                      color: colors.fontBlack,

                      lineHeight: dHeight,

                      fontWeight: valIndex === minute ? '700' : '400',
                      fontFamily: font.AnuphanMedium,
                      fontSize: 20,
                    },
                  ]}>
                  {valIndex < 10 ? `0${valIndex}` : valIndex}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  font: {
    height: 50,
    textAlign: 'center',
    paddingTop: 16,
    marginBottom: 16,
    fontFamily: font.AnuphanMedium,
    fontSize: 20,
    // lineHeight: 20,
  },
  mark: {
    position: 'absolute',
    borderRadius: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: colors.disable,
    borderTopColor: colors.disable,
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scroll: {
    width: 50,
  },
});
export default TimePicker;
