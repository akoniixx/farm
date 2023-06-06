import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import {Image, SafeAreaView, Text, View} from 'react-native';
import icons from '../../assets/icons/icons';
import {normalize} from '../../function/Normalize';

const WinnerCampaignScreen: React.FC<any> = ({navigation, route}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="ประกาศรายชื่อผู้โชคดี"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={icons.winnerCampaignBlank}
          style={{width: normalize(125), height: normalize(100)}}
        />
        <Text
          style={{
            fontFamily: font.medium,
            fontSize: normalize(15),
            color: colors.gray,
          }}>
          ติดตามประกาศรายชื่อผู้โชคดีได้เร็วๆ นี้
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default WinnerCampaignScreen;
