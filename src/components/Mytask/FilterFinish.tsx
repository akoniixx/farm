import { normalize } from '@rneui/themed';
import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
} from 'react-native';
import { Picker, onOpen, onClose } from 'react-native-actions-sheet-picker';
import { colors, font, icons } from '../../assets';
import { sortFieldFinish } from '../../definitions/taskFilter';

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

      <Picker
        id="field"
        data={sortFieldFinish}
        actionsSheetProps={{
          children: <View />,
          containerStyle: {
            height: 300,
            borderRadius: 20,
            padding: 0,
          },
        }}
        flatListProps={{
          contentContainerStyle: {
            paddingHorizontal: 0,
          },
          ListHeaderComponent: () => {
            return (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 40,
                    paddingHorizontal: 20,
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      fontSize: normalize(20),
                    }}>
                    แสดงสถานะงาน
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: font.SarabunMedium,
                        fontSize: normalize(20),
                        color: colors.greenLight,
                      }}>
                      ยกเลิก
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.separator} />
              </>
            );
          },
          data: sortFieldFinish,
          keyExtractor: (item, index) => index.toString(),
          renderItem: ({ item }) => {
            return (
              <View
                style={{
                  paddingLeft: 20,
                }}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    onClose('field');
                    setSelectedField(item);
                  }}>
                  <Text
                    style={{
                      fontFamily: font.SarabunLight,
                      fontSize: normalize(20),
                      color: colors.fontBlack,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
                <View style={styles.separator} />
              </View>
            );
          },
        }}
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
