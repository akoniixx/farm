import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import {normalize} from '../../function/Normalize';
import colors from '../../assets/colors/colors';
import dayjs from 'dayjs';
import icons from '../../assets/icons/icons';
import Divider from '../../components/Divider';
import Text from '../../components/Text';

interface Props {
  status: 'WAIT_APPROVE' | 'APPROVED' | 'REJECTED' | null;
  dateDelay: string | null;
  delayRemark: string | null;
  delayRejectRemark?: string | null;
  title?: string;
}
export default function StatusExtend({
  status = 'REJECTED',
  title = 'ขอขยายเวลาพ่น',
  dateDelay,

  delayRejectRemark,
}: Props) {
  const obj = {
    WAIT_APPROVE: 'รออนุมัติ',
    APPROVED: 'อนุมัติ',
    REJECTED: 'ไม่อนุมัติ',
  };
  const objIC = {
    WAIT_APPROVE: icons.awaitIcon,
    APPROVED: icons.approveIcon,
    REJECTED: icons.rejectIcon,
  };
  if (status === null) {
    return <View />;
  }
  return (
    <View style={styles({status}).container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: normalize(14),
              color: colors.fontBlack,
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: normalize(14),
              color: colors.fontBlack,
            }}>
            {dayjs(dateDelay).format('DD/MM/YYYY , HH:mm น.')}
          </Text>
        </View>
        <View
          style={
            styles({
              status,
            }).statusBar
          }>
          <Image
            source={objIC[status as keyof typeof objIC]}
            style={{
              width: 16,
              height: 16,
              marginRight: 4,
            }}
          />
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: normalize(14),
              lineHeight: 18,
              color: colors.white,
            }}>
            {obj[status as keyof typeof obj]}
          </Text>
        </View>
      </View>
      {status === 'REJECTED' && delayRejectRemark ? (
        <>
          <Divider borderColor="#FEE9E1" />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: normalize(14),
              color: colors.fontBlack,
            }}>
            {delayRejectRemark}
          </Text>
        </>
      ) : null}
    </View>
  );
}

const styles = ({status}: {status: string | null}) =>
  StyleSheet.create({
    container: {
      padding: 8,
      borderRadius: 16,

      borderWidth: 1,
      borderColor:
        status === 'WAIT_APPROVE'
          ? '#FEE9E1'
          : status === 'APPROVED'
          ? '#D8F5E4'
          : '#FEE9E1',
      backgroundColor:
        status === 'WAIT_APPROVE'
          ? '#FFF7F4'
          : status === 'APPROVED'
          ? '#EDFFF5'
          : '#FFF7F4',
    },
    statusBar: {
      width: 'auto',
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(4),

      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        status === 'WAIT_APPROVE'
          ? colors.orange
          : status === 'APPROVED'
          ? colors.green
          : colors.darkOrange,
    },
  });
