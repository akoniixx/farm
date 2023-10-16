import { View, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { MaintenanceEntity } from '../ModalEntity';
import { ModalStyle } from '../ModalStyle';
import { colors, icons, image } from '../../../assets';
import { normalize } from '../../../functions/Normalize';
import fonts from '../../../assets/fonts';
import { momentExtend } from '../../../utils/moment-buddha-year';
import moment from 'moment';
import Text from '../../Text/Text';
const PopUpMaintenance: React.FC<MaintenanceEntity> = ({
  show,
  onClose,
  data,
}) => {
  const start = momentExtend.toBuddhistYear(data.dateStart, 'DD MMMM YYYY');
  const end = momentExtend.toBuddhistYear(data.dateEnd, 'DD MMMM YYYY');

  return (
    <Modal visible={show} transparent={true}>
      <View style={ModalPopUpStyle.modalPopUp}>
        <View style={ModalStyle.modalBg}>
          <View style={ModalStyle.close}>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.close}
                style={{
                  width: normalize(14),
                  height: normalize(14),
                }}
              />
            </TouchableOpacity>
          </View>
          {start !== end ? (
            <>
              <Image
                source={{ uri: data.imagePath }}
                style={ModalStyle.image}
              />
              <Text
                style={[
                  ModalStyle.modalHeader,
                  { paddingVertical: normalize(20) },
                ]}>
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
                    fontSize: normalize(18),
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
                {moment(data.dateStart)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm')}
                {' - 23:59 น.'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`ถึงวันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                    fontSize: normalize(18),
                  }}>
                  {momentExtend.toBuddhistYear(data.dateEnd, 'DD MMMM YYYY')}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                ช่วงเวลา {` 00:00 - `}
                {moment(data.dateEnd)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm น.')}
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
            </>
          ) : (
            <>
              <Image
                source={{ uri: data.imagePath }}
                style={ModalStyle.image}
              />
              <Text
                style={[
                  ModalStyle.modalHeader,
                  { paddingVertical: normalize(20) },
                ]}>
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
                    fontSize: normalize(18),
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
                {moment(data.dateStart)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm')}
                {' - '}
                {moment(data.dateEnd)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm')}
                {' น.'}
              </Text>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontFamily: fonts.SarabunLight,
                    fontSize: normalize(16),
                    color: colors.fontBlack,
                    lineHeight: 30,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                  }}>
                  {data.text}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.SarabunLight,
                    fontSize: normalize(16),
                    color: colors.fontBlack,
                    lineHeight: 30,
                    textAlign: 'center',
                  }}>
                  {data.footer}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
const ModalPopUpStyle = StyleSheet.create({
  modalPopUp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PopUpMaintenance;
