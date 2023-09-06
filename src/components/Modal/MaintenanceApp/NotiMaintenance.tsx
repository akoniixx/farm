import { View, Image } from 'react-native';
import React from 'react';
import { MaintenanceEntity } from '../ModalEntity';
import { ModalStyle } from '../ModalStyle';
import { colors, image } from '../../../assets';
import { normalize } from '../../../functions/Normalize';
import fonts from '../../../assets/fonts';
import { momentExtend } from '../../../utils/moment-buddha-year';
import moment from 'moment';
import Text from '../../Text/Text';
const NotiMaintenance: React.FC<MaintenanceEntity> = ({ data }) => {
  return (
    <View style={ModalStyle.modal}>
      <View style={ModalStyle.modalBg}>
        <Image source={image.maintenance} style={ModalStyle.image} />
        <Text
          style={[ModalStyle.modalHeader, { paddingVertical: normalize(20) }]}>
          {data.header}
        </Text>
        <Text
          style={{
            fontFamily: fonts.AnuphanMedium,
            fontSize: normalize(18),
            color: colors.fontBlack,
            fontWeight: '800',
          }}>
          {`วันที่ `}
          <Text
            style={{
              color: '#FB8705',
            }}>
            {momentExtend.toBuddhistYear(data.dateStart, 'DD MMMM YYYY')}
          </Text>
        </Text>
        <Text
          style={{
            fontFamily: fonts.AnuphanMedium,
            fontSize: normalize(18),
            color: colors.fontBlack,
            fontWeight: '800',
          }}>
          ช่วงเวลา{' '}
          {moment(data.dateStart).add(543, 'year').locale('th').format('HH.mm')}
          {' - '}
          {moment(data.dateEnd).add(543, 'year').locale('th').format('HH.mm')}
          {' น.'}
        </Text>
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.SarabunLight,
              fontSize: normalize(16),
              color: colors.fontBlack,
              lineHeight: 30,
              paddingHorizontal: 20,
            }}>
            {data.text}
          </Text>
          <Text
            style={{
              fontFamily: fonts.SarabunLight,
              fontSize: normalize(16),
              color: colors.fontBlack,
              lineHeight: 30,
            }}>
            {data.footer}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotiMaintenance;
