import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import SectionBody from './SectionBody';
import { MainButton } from '../../components/Button/MainButton';
import colors from '../../assets/colors/colors';
import image from '../../assets/images/image';

export default function SlipSuccessScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'SlipSuccessScreen'>) {
  return (
    <Container>
      <Content noPadding>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Image
              source={image.successSlip}
              style={{
                width: '100%',
                height: 170,
                marginTop: 32,
              }}
              resizeMode="contain"
            />
            <SectionBody />
          </View>
          <View
            style={{
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('MainScreen')}
              style={{
                height: 52,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 16,
                width: '48%',
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.white,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Anuphan-Bold',
                  color: colors.white,
                }}>
                รายละเอียดงาน
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('MainScreen')}
              style={{
                height: 52,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 16,
                width: '48%',
                borderWidth: 1,
                borderColor: colors.orangeLight,
                backgroundColor: colors.orangeLight,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Anuphan-Bold',
                  color: colors.white,
                }}>
                กลับหน้าหลัก
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
