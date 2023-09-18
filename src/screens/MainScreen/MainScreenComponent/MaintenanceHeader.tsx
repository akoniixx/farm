import { View } from 'react-native';
import React from 'react';
import { normalize } from '../../../functions/Normalize';
import { Image } from 'react-native';
import { font, image } from '../../../assets';
import { momentExtend } from '../../../utils/moment-buddha-year';
import colors from '../../../assets/colors/colors';
import moment from 'moment';
import Text from '../../../components/Text/Text';

interface Props {
  maintenance: any;
  checkDateNoti: boolean;
  start: any;
  end: any;
}
export default function MaintenanceHeader({
  maintenance,
  checkDateNoti,
  start,
  end,
}: Props) {
  const sameDay = moment(start).isSame(end, 'day');

  return (
    <View>
      {checkDateNoti === true && (
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
                  source={{ uri: maintenance.imagePath }}
                  style={{ width: 58, height: 60 }}
                />
              </View>
              <View style={{ paddingHorizontal: 30 }}>
                {!sameDay ? (
                  <View>
                    <Text
                      style={{
                        fontFamily: font.AnuphanMedium,
                        fontSize: normalize(18),
                        color: colors.fontBlack,
                        fontWeight: '800',
                      }}>
                      {'วันที่ '}
                      <Text
                        style={{
                          color: '#FB8705',
                          fontSize: normalize(18),
                        }}>
                        {momentExtend.toBuddhistYear(
                          maintenance.dateStart,
                          ' DD MMMM YYYY',
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
                      {moment(maintenance.dateStart)
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
                      ถึงวันที่
                      <Text
                        style={{
                          color: '#FB8705',
                          fontSize: normalize(18),
                        }}>
                        {momentExtend.toBuddhistYear(
                          maintenance.dateEnd,
                          ' DD MMMM YYYY',
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
                      ช่วงเวลา 00:00 -
                      {moment(maintenance.dateEnd)
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
                      วันที่
                      <Text
                        style={{
                          color: '#FB8705',
                          fontSize: normalize(18),
                        }}>
                        {maintenance != null &&
                          momentExtend.toBuddhistYear(
                            maintenance.dateStart,
                            ' DD MMMM YYYY',
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
                      {moment(maintenance.dateStart)
                        .add(543, 'year')
                        .locale('th')
                        .format('HH.mm')}
                      {' - '}
                      {moment(maintenance.dateEnd)
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
                  {maintenance.text}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
