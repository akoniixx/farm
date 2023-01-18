import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

interface Prop {
  hour: number;
  minute: number;
  setHour: (h: number) => void;
  setMinute: (m: number) => void;
}

const TimePicker: React.FC<Prop> = ({ setHour, setMinute, hour, minute }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <View>
        <ScrollView
          style={{ width: 50, height: 50 }}
          onMomentumScrollEnd={e => {
            let newVal = Math.round(e.nativeEvent.contentOffset.y / 50);
            if (newVal === 0) {
              newVal = 23;
            } else if (newVal === 23) {
              newVal = 0;
            }
            setHour(newVal);
          }}
          scrollEventThrottle={16}
          snapToInterval={50}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}>
          {Array.from({ length: 24 }, (_, i) => i).map(num => (
            <Text
              key={num}
              style={{ height: 50, textAlign: 'center', paddingTop: 15 }}>
              {num < 10 ? `0${num}` : num}
            </Text>
          ))}
        </ScrollView>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Text>:</Text>
      </View>

      <View>
        <ScrollView
          style={{ width: 50, height: 50 }}
          onMomentumScrollEnd={e => {
            let newVal = Math.round(e.nativeEvent.contentOffset.y / 50);
            if (newVal === 0) {
              newVal = 59;
            } else if (newVal === 59) {
              newVal = 0;
            }
            setMinute(newVal);
          }}
          scrollEventThrottle={16}
          snapToInterval={50}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}>
          {Array.from({ length: 60 }, (_, i) => i).map(num => (
            <Text
              key={num}
              style={{ height: 50, textAlign: 'center', paddingTop: 15 }}>
              {num < 10 ? `0${num}` : num}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TimePicker;
