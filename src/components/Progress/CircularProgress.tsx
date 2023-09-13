import {View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
const CircularProgress = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Svg height="20%" width="20%">
        <Circle
          cx="20px"
          cy="20px"
          r="15px"
          stroke="#000"
          strokeWidth="4px"
          fill="transparent"
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;
