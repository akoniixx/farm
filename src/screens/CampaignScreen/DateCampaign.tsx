import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import {Dimensions, Image, SafeAreaView, Text, View} from 'react-native';
import icons from '../../assets/icons/icons';
import {normalize} from '../../function/Normalize';

const DateCampaignScreen: React.FC<any> = ({navigation, route}) => {
  const width = Dimensions.get('window').width;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="ตารางการจับรางวัล"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={{uri: route.params.image}}
          style={{width: width - 15, height: width - 15}}
        />
      </View>
    </SafeAreaView>
  );
};

export default DateCampaignScreen;
