import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';

export default function SelectInjectionSheet(props: SheetProps) {
  const {
    periodSpray,
    currentVal,
  }: {
    periodSpray: {
      value: string;
      label: string;
    }[];
    currentVal: {
      value: string;
      label: string;
    };
  } = props.payload;
  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        height: '50%',
      }}>
      <View style={styles.container}>
        <View
          style={{
            marginTop: 8,
            height: 5,
            borderRadius: 10,
            width: 50,
            backgroundColor: '#EBEEF0',
            marginBottom: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            alignItems: 'center',
            paddingVertical: 8,
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: fonts.AnuphanMedium,
            }}>
            ช่วงเวลาการพ่น
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (currentVal?.value !== '') {
                SheetManager.hide(props.sheetId, {
                  payload: currentVal,
                });
              } else {
                SheetManager.hide(props.sheetId, {
                  payload: {
                    value: '',
                    label: '',
                  },
                });
              }
            }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.primary,
                fontFamily: fonts.SarabunMedium,
              }}>
              ยกเลิก
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={[...periodSpray]}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => <View style={{ height: 32 }} />}
          contentContainerStyle={{}}
          style={{ width: '100%', flex: 1, height: '100%' }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  paddingLeft: 16,
                }}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    SheetManager.hide(props.sheetId, {
                      payload: item,
                    });
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
                <View style={styles.separator} />
              </View>
            );
          }}
        />
      </View>
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
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
