import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
// import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import {image} from '../../assets';

export default function ProgressBarAnimated({
  current = 0,
  total = 100,
  height = 14,
}: {
  current?: number;
  total?: number;
  height?: number;
  color?: string;
}) {
  const progress = (current / total) * 100;
  const lottieWidth = (progress / 100) * 200;
  return (
    <View style={[styles.container, {height}]}>
      {/* <LinearGradient
        colors={['#F89132', '#FFDE1F']}
        start={{x: 0, y: 0}}
        end={{x: 0.6, y: 0.4}}
        style={[styles.progress, {width: `${progress}%`}]}
      /> */}
      <View
        style={{
          width: lottieWidth,
          height: '100%',
        }}>
        <Lottie
          autoPlay
          loop
          source={image.missionProgressBar}
          style={[
            styles.progress,
            {
              flex: 1,
            },
          ]}
          resizeMode="cover"
          speed={1}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    alignItems: 'flex-start',
  },
  progress: {
    alignSelf: 'flex-start',
  },
});
