import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import fonts from '../../assets/fonts';
import { colors, image } from '../../assets';
import SlipCard, { TaskDataTypeSlip } from '../../components/SlipCard/SlipCard';
import icons from '../../assets/icons/icons';
import { DronerDatasource } from '../../datasource/DronerDatasource';
import { DronerCard } from '../../components/Mytask/DronerCard';

export default function SectionBody(props: TaskDataTypeSlip) {
  const [profilePath,setProfilePath] = useState<string>("")
  useEffect(()=>{
    DronerDatasource.getDronerData(props.droner.dronerId).then(
      res => {
        res.file.map((item : any) => {
          if(item.category === "PROFILE_IMAGE"){
            DronerDatasource.getDronerProfileImage(item.path).then(
              res => setProfilePath(res)
            )
          }
        })
      })
  },[])
  return (
    <View style={styled.container}>
      <View>
        <Text
          style={{
            color: colors.greenLight,
            fontFamily: fonts.AnuphanBold,
            fontSize: 24,
            textAlign: 'center',
            paddingVertical: 8,
          }}>
          นักบินโดรนรับงานแล้ว
        </Text>
        <Text
          style={{
            color: colors.fontBlack,
            textAlign: 'center',
            fontFamily: fonts.SarabunMedium,
            fontSize: 18,
          }}>
          คุณสามารถติดต่อพูดคุย กับนักบินโดรนได้เลย
        </Text>
        <View style={styled.shadow}>
          <DronerCard 
            name={props.droner.firstname + ' ' + props.droner.lastname}
            profile={profilePath}
            telnumber={props.droner.telephoneNo}
          />
        </View>
        <SlipCard {...props} />
      </View>
    </View>
  );
}
const styled = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
  },
  fontSarabunM: {
    fontFamily: fonts.SarabunMedium,
  },
  fontSarabunB: {
    fontFamily: fonts.SarabunBold,
  },
  dronerCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});
