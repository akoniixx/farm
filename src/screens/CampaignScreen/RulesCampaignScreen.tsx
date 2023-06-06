import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import {Image, SafeAreaView, Text, View} from 'react-native';
import icons from '../../assets/icons/icons';
import {normalize} from '../../function/Normalize';

const RulesCampaignScreen: React.FC<any> = ({navigation, route}) => {
  let rules = route.params.rules;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="กติกาและเงื่อนไข"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <View style={{flex: 1, paddingHorizontal: normalize(15)}}>
        <ScrollView>
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: normalize(15),
              color: colors.gray,
            }}>
            {rules}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default RulesCampaignScreen;
