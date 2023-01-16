
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import StepIndicator from 'react-native-step-indicator-v2';
import { normalize } from '../functions/Normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../assets';

interface Prop {
    onPressBack?: () => void;
    curentPosition: number;
    label: string;
}
const StepIndicatorHead: React.FC<Prop> = ({ onPressBack, curentPosition, label }) => {
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
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
        borderRadiusSize: 20
    }
    return (
        <>
            <SafeAreaView style={{ flexDirection: 'row', backgroundColor: 'rgba(46, 196, 109, 0.05)' }} edges={['top','left','right']} >
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity
                        style={{ paddingVertical: 14, paddingHorizontal: normalize(10) }}
                        onPress={onPressBack}>
                        <Icon name="left" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flex: 5,
                    justifyContent: 'center', paddingHorizontal: normalize(50)
                }}>
                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={curentPosition}
                        stepCount={3}
                    />
                </View>
            </SafeAreaView>

            <View style={{ backgroundColor: 'rgba(46, 196, 109, 0.05)', justifyContent: 'center', alignItems: 'center' ,paddingBottom:10}}>
                <Text style={{fontFamily:font.AnuphanMedium,fontSize:normalize(18),color:colors.fontBlack,marginTop:10}}>จ้างโดรนเกษตร</Text>
                <Text style={{fontFamily:font.AnuphanBold,fontSize:normalize(26),color:colors.greenLight}}>
                    {label}
                </Text>
            </View>
        </>
    )
}
export default StepIndicatorHead