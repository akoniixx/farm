import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import DronerFailedModal from '../../components/Modal/DronerFailedModal';

export default function SlipWaitingScreen({
  navigation,route
}: StackScreenProps<MainStackParamList, 'SlipWaitingScreen'>) {
  const modal = route.params?.modal??false
  console.log(modal)
  const [showModal,setShowModal] = useState<boolean>(modal!)

  return (
    <View style={{
      flex : 1,
      backgroundColor : '#FFFEFA'
    }}>
      <Header
        style={{
          paddingTop : 60
        }}
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
            <LinearGradient
              colors={['#FFFEFA', '#41A97A']}
            >
              <SectionBody />
            </LinearGradient>
          </View>
          <View
            style={{
              backgroundColor : '#41A97A',
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
      <DronerFailedModal 
        show={showModal}
        onClose={()=>{
          setShowModal(false)
        }}
        onMainClick={()=>{
          setShowModal(false)
        }}
      />
    </View>
  );
}
