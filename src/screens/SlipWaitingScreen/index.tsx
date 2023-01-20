import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import icons from '../../assets/icons/icons';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import { image } from '../../assets';
import SectionBody from './SectionBody';
import { MainButton } from '../../components/Button/MainButton';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';

export default function SlipWaitingScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'SlipWaitingScreen'>) {
  return (
    <Container>
      <Header
        componentLeft={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.arrowUp}
              style={{
                width: 24,
                height: 24,
                transform: [{ rotate: '180deg' }],
              }}
            />
          </TouchableOpacity>
        }
        componentRight={
          <TouchableOpacity
            onPress={() => {
              console.log('cancel');
            }}>
            <Text
              style={{
                color: colors.error,
                fontFamily: fonts.AnuphanBold,
                fontSize: 18,
              }}>
              ยกเลิกการจอง
            </Text>
          </TouchableOpacity>
        }
      />
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
              source={image.waitingDroner}
              style={{
                width: '100%',
                height: 320,
              }}
              resizeMode="contain"
            />
            <SectionBody />
          </View>
          <View
            style={{
              padding: 16,
            }}>
            <MainButton
              label="กลับหน้าหลัก"
              onPress={() => navigation.navigate('MainScreen')}
              color={colors.orangeLight}
              style={{
                height: 52,
              }}
            />
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
