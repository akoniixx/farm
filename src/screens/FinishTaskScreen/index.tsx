import {View, StyleSheet, Platform, ScrollView} from 'react-native';
import React, {useMemo} from 'react';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import Text from '../../components/Text';
import StepOne from './StepOne';
import AsyncButton from '../../components/Button/AsyncButton';
import StepTwo from './StepTwo';

const staticData = [
  {
    key: 0,
    title: 'ภาพถ่าย\nหลักฐานการบิน ',
  },
  {
    key: 1,
    title: 'ภาพถ่ายปุ๋ย/ยา',
  },
];
export interface ImageDataType {
  errorMessage?: string | null;
  isError?: boolean;
  assets: {
    fileSize: number;
    type: string;
    fileName: string;
    uri: string;
    errorMessage?: string[];
    isError?: boolean;
    errorTypeList?: Array<
      'isAfter' | 'isBefore' | 'isSize' | 'isType' | 'isDuplicate'
    >;
  }[];
}

export interface ImageSprayType {
  errorMessage?: string | null;
  isError?: boolean;
  assets: {
    fileSize: number;
    type: string;
    fileName: string;
    uri: string;
  }[];
}
interface Props {
  navigation: StackNavigationProp<StackParamList, 'FinishTaskScreen'>;
  route: RouteProp<StackParamList, 'FinishTaskScreen'>;
}
export default function FinishTaskScreen({navigation, route}: Props) {
  const [imageData, setImageData] = React.useState<ImageDataType>({
    isError: false,
    assets: [],
  });
  const [imageSpray, setImageSpray] = React.useState<ImageSprayType>({
    isError: false,
    assets: [],
  });
  const {taskAppointment} = route.params;
  const onPressBack = () => {
    navigation.goBack();
  };
  const [step, setStep] = React.useState(0);
  const RenderStep = useMemo(() => {
    if (step === 0) {
      return () => (
        <StepOne
          imageData={imageData}
          setImageData={setImageData}
          taskAppointment={taskAppointment}
        />
      );
    }
    return () => (
      <StepTwo imageSpray={imageSpray} setImageSpray={setImageSpray} />
    );
  }, [
    step,
    setImageData,
    imageData,
    taskAppointment,
    imageSpray,
    setImageSpray,
  ]);
  const onNextStep = () => {
    setStep(step + 1);
  };
  const onCancel = () => {
    setStep(0);
    setImageData({
      isError: false,
      assets: [],
    });
  };
  return (
    <SafeAreaView style={styles.safeView}>
      <CustomHeader
        title={'งานเสร็จสิ้น'}
        onPressBack={onPressBack}
        showBackBtn
      />
      <Text style={styles.subTitle}>กรุณาอัพโหลดภาพงานเสร็จสิ้น 2 ภาพ</Text>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
                borderBottomColor: colors.disable,
                borderBottomWidth: 1,
              }}>
              {staticData.map((item, index) => {
                const isActive = index === step;
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isActive
                        ? colors.orangeSoft
                        : colors.white,

                      flex: 1,
                      minHeight: 60,
                      paddingHorizontal: 8,

                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}>
                    <View
                      style={{
                        backgroundColor: isActive
                          ? colors.orange
                          : colors.white,
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 8,
                        borderWidth: isActive ? 0 : 1,
                        borderColor: colors.grey3,
                      }}>
                      <Text
                        style={{
                          lineHeight: Platform.OS === 'android' ? 24 : 24,
                          fontFamily: font.semiBold,
                          fontSize: 18,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          color: isActive ? colors.white : colors.grey3,
                        }}>
                        {index + 1}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          fontFamily: font.semiBold,
                          fontSize: 16,
                          color: isActive ? colors.fontBlack : colors.grey3,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <RenderStep />
          </View>
          <View style={styles.rowFooter}>
            <AsyncButton
              onPress={onCancel}
              type="secondary"
              title={step === 0 ? 'ยกเลิก' : 'ย้อนกลับ'}
              style={{
                flex: 1,
              }}
            />
            <View
              style={{
                width: 16,
              }}
            />
            <AsyncButton
              onPress={onNextStep}
              title="ถัดไป"
              style={{
                flex: 1,
              }}
              disabled={imageData?.assets?.length < 1}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  safeView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  subTitle: {
    fontSize: 16,
    color: colors.fontBlack,
    marginBottom: 8,
    textAlign: 'center',
  },
  rowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});
