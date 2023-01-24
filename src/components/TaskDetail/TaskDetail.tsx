import moment from 'moment';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, font, icons } from '../../assets';
import { normalize } from '../../functions/Normalize';

interface DateTimeProp {
  date: string;
  time: string;
  note: string;
}

interface PlotDetailProp {
  plotName: string;
  plotAmout: number;
  plant: string;
  location: string;
  onPressMap?: () => void;
}

interface TargetSprayProp {
  target: string;
  periodSpray: string;
  preparationBy: string;
}

export const DateTimeDetail: React.FC<DateTimeProp> = ({
  date,
  time,
  note,
}) => {
  return (
    <>
      <View>
        <View
          style={{
            padding: normalize(10),
            backgroundColor: '#FFF2E3',
            borderRadius: 10,
            marginTop: normalize(10),
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Image
                source={icons.calendarOrange}
                style={{
                  width: normalize(18),
                  height: normalize(20),
                  marginRight: normalize(10),
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.h2}>วันที่</Text>
                <Text style={styles.h2}>เวลา</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.h1}>
                  {moment(date)
                    .add(543, 'year')
                    .locale('th')
                    .format('DD MMMM YYYY')}
                </Text>
                <Text style={styles.h1}>
                  {' '}
                  {moment(time).locale('th').format('hh.mm')} น
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          paddingTop: 10,
          alignItems: 'center',
          borderTopColor: colors.greyDivider,
          borderTopWidth: 1,
          height: 40,
          paddingHorizontal: 16,
        }}>
        <Image
          source={icons.document}
          style={{
            width: normalize(24),
            height: normalize(24),
            marginRight: normalize(10),
          }}
        />
        <Text>{note ? note : '-'}</Text>
      </View>
    </>
  );
};

export const PlotDetail: React.FC<PlotDetailProp> = ({
  plotName,
  plotAmout,
  plant,
  location,
  onPressMap,
}) => {
  const dataKeyObj = {
    amountPlot: {
      icon: icons.plot,
      label: 'จำนวนไร่',
      value: `${plotAmout} ไร่`,
    },
    plant: {
      icon: icons.plant,
      label: 'พืชที่ปลูก',
      value: plant,
    },
    location: {
      icon: icons.location,
      label: 'ตำแหน่ง',
      value: location,
    },
  };

  return (
    <View
      style={{
        padding: normalize(10),
        backgroundColor: '#ECFBF2',
        borderRadius: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}>
        <View style={{ width: '60%' }}>
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { color: '#1F8449', marginBottom: normalize(10) },
            ]}>
            {plotName}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', width: '40%' }}>
          <TouchableOpacity onPress={onPressMap}>
            <Image
              source={icons.map}
              style={{
                width: normalize(18),
                height: 16,
                marginBottom: normalize(10),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{}}>
        {Object.keys(dataKeyObj).map((key, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: normalize(10),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={dataKeyObj[key as keyof typeof dataKeyObj].icon}
                  style={{
                    width: normalize(20),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text style={styles.h1}>
                  {dataKeyObj[key as keyof typeof dataKeyObj].label}
                </Text>
              </View>
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.h1,
                    {
                      textAlign: 'right',
                      width: Dimensions.get('window').width * 0.5,
                    },
                  ]}>
                  {dataKeyObj[key as keyof typeof dataKeyObj].value}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const TargetSpray: React.FC<TargetSprayProp> = ({
  target,
  periodSpray,
  preparationBy,
}) => {
  return (
    <View
      style={{
        padding: normalize(10),
        backgroundColor: '#E8F6FF',
        borderRadius: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={[styles.h2, { marginBottom: normalize(10) }]}>
            ช่วงเวลาการพ่น
          </Text>
          <Text style={[styles.h2, { marginBottom: normalize(10) }]}>
            เป้าหมายการพ่น
          </Text>
          <Text style={[styles.h2, { marginBottom: normalize(10) }]}>
            ยาที่ต้องใช้
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.h1, { marginBottom: normalize(10) }]}>
            {periodSpray}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.h1,
              { marginBottom: normalize(10), width: 180, textAlign: 'right' },
            ]}>
            {target}
          </Text>
          <Text style={[styles.h1, { marginBottom: normalize(10) }]}>
            {preparationBy}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    lineHeight: normalize(30),
  },
  h2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    lineHeight: normalize(30),
  },
  label: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(19),
  },
});
