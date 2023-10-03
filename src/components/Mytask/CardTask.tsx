import moment from 'moment';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, icons } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import { getStatusToText, numberWithCommas } from '../../functions/utility';
import { DronerCard } from './DronerCard';
import { WaittingCard } from './WaitingCard';
import Text from '../Text/Text';

interface taskListProps {
  task: {
    task_no: string;
    status: string;
    total_price: string;
    plant_name: string;
    target_spray: Array<string>;
    date_appointment: string;
    plot_name: string;
    rai_amount: string;
    droner: {
      image_profile: string;
      firstname: string;
      lastname: string;
      telephone_no: string;
    };
    purpose_spray_name: string;
    task_late_status: boolean;
  };
}

export const CardTask: React.FC<taskListProps> = ({ task }) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingTop: 16,
        paddingHorizontal: 10,
        marginVertical: normalize(10),
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.statusNo}>{task.task_no}</Text>
        </View>

        <View
          style={{
            backgroundColor: getStatusToText(task.status)?.bgcolor,
            borderColor: getStatusToText(task.status)?.border,
            borderWidth: 1,
            borderRadius: 18,
            paddingVertical: normalize(5),
            paddingHorizontal: normalize(10),
          }}>
          <Text
            style={{
              fontFamily: fonts.AnuphanMedium,
              fontSize: normalize(16),
              color: getStatusToText(task.status)?.color,
            }}>
            {getStatusToText(task.status)?.label}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: normalize(10),
        }}>
        <View style={{ flex: 0.6 }}>
          <Text numberOfLines={1} style={styles.plant}>
            {task.plant_name + ' | ' + task.purpose_spray_name}
          </Text>
        </View>
        <View
          style={{
            flex: 0.4,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Text style={styles.price}>
            {numberWithCommas(task.total_price, true) + ' ' + 'บาท'}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: normalize(10),
        }}>
        <Image
          source={icons.calendarGreen}
          style={{
            width: normalize(15),
            height: normalize(17),
            marginRight: normalize(10),
          }}
        />
        <Text style={styles.plot}>
          {moment(task.date_appointment)
            .add(543, 'year')
            .locale('th')
            .format('DD MMMM YYYY, HH.mm')}
          {' น.'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: normalize(10),
        }}>
        <Image
          source={icons.plotGreen}
          style={{
            width: normalize(15),
            height: normalize(17),
            marginRight: normalize(10),
          }}
        />
        <Text style={styles.plot}>
          {task.plot_name + ', ' + task.rai_amount + ' ไร่'}
        </Text>
      </View>
      {task.task_late_status && task.status === 'WAIT_START' ? (
        <View style={styles.lateBox}>
          <Text style={[styles.plot, { fontFamily: fonts.SarabunMedium }]}>
            ขณะนี้! เลยเวลานัดหมาย
          </Text>
          <Text style={[styles.plot, { fontFamily: fonts.SarabunMedium }]}>
            กรุณาติดต่อนักบินโดรนให้กดเริ่มงาน
          </Text>
        </View>
      ) : (
        <></>
      )}
      {task.status === 'CANCELED' ? (
        <View
          style={{
            height: 16,
          }}
        />
      ) : (
        <View
          style={{
            marginTop: normalize(20),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: colors.disable,
          }}>
          {task.status === 'WAIT_RECEIVE' ? (
            <WaittingCard />
          ) : task.status === 'CANCELED' ? (
            <></>
          ) : (
            <DronerCard
              name={task.droner.firstname + ' ' + task.droner.lastname}
              profile={task.droner.image_profile}
              telnumber={task.droner.telephone_no}
            />
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  statusNo: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(14),
    color: '#8D96A0',
  },
  price: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(20),
    color: '#2EC46D',
  },
  plant: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  plot: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  lateBox: {
    marginTop: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF2F2',
    borderColor: '#EF4E4E',
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    padding: normalize(10),
  },
});
