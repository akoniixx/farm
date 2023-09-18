import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import {SafeAreaView, View} from 'react-native';
import {normalize} from '../../function/Normalize';
import {mixpanel} from '../../../mixpanel';
import Text from '../../components/Text';

const RulesCampaignScreen: React.FC<any> = ({navigation, route}) => {
  let rules = route.params.rules;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        title="กติกาและเงื่อนไข"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('กดย้อนกลับจากหน้ากติกาทอง');
          navigation.goBack();
        }}
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
