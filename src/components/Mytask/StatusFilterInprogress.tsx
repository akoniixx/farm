import { normalize } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { onOpen } from 'react-native-actions-sheet-picker';
import { font, icons } from '../../assets';
import { sortStatusInprogress } from '../../definitions/taskFilter';
import PickerFilter from '../PickerFilter/PickerFilter';
import Text from '../Text/Text';

interface props {
  selectedStatus: {
    name: string;
    value: string;
  };
  setSelectedStatus: (value: any) => void;
}

export const StatusFilterInprogress: React.FC<props> = ({
  selectedStatus,
  setSelectedStatus,
}) => {
  const [status, setStatus] = useState<any>([]);

  useEffect(() => {
    setStatus(sortStatusInprogress);
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onOpen('status');
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.h1}>{selectedStatus && selectedStatus.name}</Text>
          <Image
            source={icons.chevron}
            style={{
              width: normalize(14),
              height: 8,
              marginLeft: normalize(10),
            }}
          />
        </View>
      </TouchableOpacity>

      <PickerFilter
        setSelected={setSelectedStatus}
        data={status}
        title="แสดงสถานะงาน"
        id="status"
        height={400}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    borderWidth: 0.5,
    borderColor: '#C0C5CA',
    padding: normalize(10),
    borderRadius: 10,
    minWidth: normalize(160),
  },
  h1: {
    fontSize: normalize(18),
    fontFamily: font.SarabunMedium,
    color: '#8D96A0',
    lineHeight: normalize(26),
  },
});
