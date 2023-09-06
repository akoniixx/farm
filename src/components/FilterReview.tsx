import { normalize } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Picker, onOpen } from 'react-native-actions-sheet-picker';
import { font, icons } from '../assets/index';
import { sortFieldReview } from '../definitions/reviewFilter';
import Text from './Text/Text';

interface props {
  selectedField: {
    name: string;
    value: string;
    direction: string;
  };
  setSelectedField: (value: any) => void;
}

export const FilterReview: React.FC<props> = ({
  selectedField,
  setSelectedField,
}) => {
  const [field, setField] = useState<any>([]);

  useEffect(() => {
    setField(sortFieldReview);
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onOpen('field');
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'auto',
          }}>
          <Text style={styles.h1}>{selectedField && selectedField.name}</Text>
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

      <Picker
        id="field"
        data={field}
        label="เรียงลำดับรีวิว"
        setSelected={setSelectedField}
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
    minWidth: normalize(180),
  },
  h1: {
    fontSize: normalize(18),
    fontFamily: font.SarabunMedium,
    color: '#8D96A0',
  },
});
