import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import { Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import StepIndicator from 'react-native-step-indicator-v2';
import { normalize } from '../functions/Normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../assets';
import images from '../assets/images/image';
import icons from '../assets/icons/icons';

interface Prop {
  onPressBack?: () => void;
  curentPosition: number;
  label: string;
}
const StepIndicatorHead: React.FC<Prop> = ({
  onPressBack,
  curentPosition,
  label,
}) => {
  const customStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize: 20,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#FFE26E',
    stepStrokeWidth: 3,

    stepStrokeFinishedColor: '#2EC46D',
    stepStrokeUnFinishedColor: '#C7F2D9',
    separatorFinishedColor: '#2EC46D',
    separatorUnFinishedColor: '#C7F2D9',
    stepIndicatorFinishedColor: '#2EC46D',
    stepIndicatorUnFinishedColor: '#C7F2D9',
    stepIndicatorCurrentColor: '#2EC46D',
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    borderRadiusSize: 20,
  };
  return (
    <>
      <SafeAreaView
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(46, 196, 109, 0.05)',
        }}
        edges={['top', 'left', 'right']}>
        <View
          style={{
            paddingTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            minHeight: 50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              top: 8,
            }}>
            <TouchableOpacity
              style={{ paddingVertical: 14, paddingHorizontal: normalize(10) }}
              onPress={onPressBack}>
              <Icon name="left" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <View
              style={{
                width: '40%',
              }}>
              <StepIndicator
                customStyles={customStyles}
                currentPosition={curentPosition}
                stepCount={3}
                renderStepIndicator={({ stepStatus }) => {
                  if (stepStatus === 'finished') {
                    return (
                      <View>
                        <Image
                          source={icons.checkboxWhite}
                          style={{ width: 12, height: 14 }}
                        />
                      </View>
                    );
                  }
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View
        style={{
          backgroundColor: 'rgba(46, 196, 109, 0.05)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
        <Text
          style={{
            fontFamily: font.AnuphanMedium,
            fontSize: normalize(18),
            color: colors.fontBlack,
            marginTop: 10,
          }}>
          จ้างโดรนเกษตร
        </Text>
        <Text
          style={{
            fontFamily: font.AnuphanBold,
            fontSize: normalize(26),
            color: colors.primary60,
          }}>
          {label}
        </Text>
      </View>
    </>
  );
};
export default StepIndicatorHead;
