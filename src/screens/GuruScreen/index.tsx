import {SafeAreaView, View} from 'react-native';
import React, {useRef} from 'react';
import Text from '../../components/Text';
import Video, {OnProgressData} from 'react-native-video';

export default function GuruScreen() {
  const videoRef = useRef<Video>(null);
  const [progress, setProgress] = React.useState(0);
  const handleProgress = (progress: OnProgressData) => {
    const percent = (progress.currentTime / progress.seekableDuration) * 100;
    setProgress(percent);
  };
  console.log('progress', progress);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text>GuruScreen</Text>
        <Video
          style={{width: '100%', height: 300}}
          ref={videoRef}
          onProgress={handleProgress}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          controls={true}
        />
      </View>
    </SafeAreaView>
  );
}
