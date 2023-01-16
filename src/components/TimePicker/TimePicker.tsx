import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

const TimePicker = () => {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text>Hour</Text>
        <ScrollView
          style={{ width: 100, height: 50 }}
          onMomentumScrollEnd={(e) => {
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
          showsVerticalScrollIndicator={false}
        >
          {Array.from({length: 24}, (_, i) => i).map(num => (
            <Text key={num} style={{height: 50, textAlign: 'center', paddingTop: 15}}>{num < 10 ? `0${num}` : num}</Text>
          ))}
        </ScrollView>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text>Minute</Text>
        <ScrollView
          style={{ width: 100, height: 50 }}
          onMomentumScrollEnd={(e) => {
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
          showsVerticalScrollIndicator={false}
        >
          {Array.from({length: 60}, (_, i) => i).map(num => (
            <Text key={num} style={{height: 50, textAlign: 'center', paddingTop: 15}}>{num < 10 ? `0${num}` : num}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TimePicker;
