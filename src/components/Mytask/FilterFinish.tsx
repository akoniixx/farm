import { normalize } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { onOpen } from 'react-native-actions-sheet-picker';
import { colors, font, icons } from '../../assets';
import { sortFieldFinish } from '../../definitions/taskFilter';
import PickerFilter from '../PickerFilter/PickerFilter';
import Text from '../Text/Text';

interface props {
  selectedField: {
    name: string;
    value: string;
    direction: string;
  };
  setSelectedField: (value: any) => void;
}

export const FilterFinish: React.FC<props> = ({
  selectedField,
  setSelectedField,
}) => {
  // const [field, setField] = useState([]);

  // useEffect(() => {
  //   setField();
  // }, []);
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

      <PickerFilter
        setSelected={setSelectedField}
        data={sortFieldFinish}
        title="แสดงสถานะงาน"
        id="field"
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
  },
  row: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.disable,
    width: '100%',
  },
});
