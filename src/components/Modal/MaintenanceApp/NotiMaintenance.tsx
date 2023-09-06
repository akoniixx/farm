import { View, Text, Image } from 'react-native';
import React from 'react';
import { MaintenanceEntity, ModalEntity } from '../ModalEntity';
import { colors, font, icons, image } from '../../../assets';
import { normalize, width } from '../../../functions/Normalize';
import { momentExtend } from '../../../utils/moment-buddha-year';
import moment from 'moment';
const NotiMaintenance: React.FC<MaintenanceEntity> = ({ data }) => {
  const start = momentExtend.toBuddhistYear(data.dateStart, 'DD MMMM YYYY');
  const end = momentExtend.toBuddhistYear(data.dateEnd, 'DD MMMM YYYY');

  return (
    <View style={{ marginTop: 20, marginBottom: 20 }}>
      <View
        style={{
          paddingHorizontal: 20,
          height: 'auto',
          width: normalize(340),
          alignSelf: 'center',
          backgroundColor: '#ECFBF2',
          borderRadius: 10,
        }}>
        <View
          style={{
            paddingVertical: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View style={{ marginTop: 15 }}>
            <Image
              source={{ uri: data.imagePath }}
              style={{ width: 58, height: 60 }}
            />
          </View>
          <View style={{ paddingHorizontal: 30 }}>
            {start !== end ? (
              <View>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                    fontWeight: '800',
                  }}>
                  {`วันที่ `}
                  <Text
                    style={{
                      color: '#FB8705',
                    }}>
                    {momentExtend.toBuddhistYear(
                      data.dateStart,
                      'DD MMMM YYYY',
                    )}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
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
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                    fontWeight: '800',
                  }}>
                  {`ถึงวันที่ `}
                  <Text
                    style={{
                      color: '#FB8705',
                    }}>
                    {momentExtend.toBuddhistYear(data.dateEnd, 'DD MMMM YYYY')}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                    fontWeight: '800',
                  }}>
                  ช่วงเวลา
                  {` 00:00 - `}
                  {moment(data.dateEnd)
                    .add(543, 'year')
                    .locale('th')
                    .format('HH.mm น.')}
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                    fontWeight: '800',
                  }}>
                  {`วันที่ `}
                  <Text
                    style={{
                      color: '#FB8705',
                    }}>
                    {data != null &&
                      momentExtend.toBuddhistYear(
                        data.dateStart,
                        'DD MMMM YYYY',
                      )}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
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
              </View>
            )}
            <Text
              style={{
                marginRight: 20,
                fontFamily: font.SarabunLight,
                fontSize: normalize(16),
                color: colors.fontBlack,
              }}>
              {data.text}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default NotiMaintenance;
