import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
  const [scrollYHour, setScrollYHour] = React.useState(0);
  const scrollRefHour = useRef<any>(null);
  const scrollRefMinute = useRef<any>(null);
  const dHeight = 55;
  const height = 120;
  const { hourList, minuteList } = useMemo(() => {
    const hourList = Array.from({ length: 24 }, (_, i) => i);
    const minuteList = Array.from({ length: 60 }, (_, i) => i);
    return {
      hourList,
      minuteList,
    };
  }, []);
  const handleMomentumScrollEnd = ({ nativeEvent }: any) => {
    // const digit = Math.round(nativeEvent.contentOffset.y / dHeight + digits[0]);
  };
  const snapScrollToIndexHour = (index: number) => {
    scrollRefHour?.current?.scrollTo({ y: dHeight * index, animated: false });
  };
  const snapScrollToIndexMinute = (index: number) => {
    scrollRefMinute?.current?.scrollTo({ y: dHeight * index, animated: false });
  };
  console.log('hour', hour);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        height,
      }}>
      <ScrollView
        ref={scrollRefHour}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={0}
        onScroll={({ nativeEvent }) => {
          // const currentScroll = nativeEvent.contentOffset.y;
          // const scrollDirection = currentScroll > scrollYHour ? 'down' : 'up';
          // setScrollYHour(currentScroll);
          // if (scrollDirection === 'down') {
          //   setHour(hour + 1);
          // }
          // if (scrollDirection === 'up') {
          //   setHour(hour - 1);
          // }
        }}
        onMomentumScrollEnd={handleMomentumScrollEnd}>
        {hourList.map((value: any, valIndex: any) => {
          const isLast = valIndex === hourList.length - 1;
          return (
            <TouchableOpacity
              style={{
                width: 50,
                justifyContent: 'center',

                alignItems: 'center',
                marginBottom: isLast ? height / 2 - dHeight / 2 : 0,
                marginTop: valIndex === 0 ? height / 2 - dHeight / 2 : 0,
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
      <Text
        style={{
          fontFamily: font.AnuphanMedium,
        }}>
        :
      </Text>
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
});
export default TimePicker;
