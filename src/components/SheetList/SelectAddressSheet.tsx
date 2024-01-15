import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';

const SelectAddressSheet = ({ sheetId, payload }: SheetProps) => {
  return (
    <ActionSheet
      id={sheetId}
      onClose={() => {
        SheetManager.hide(sheetId);
      }}
      containerStyle={{
        height: '65%',
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
            justifyContent: 'center',
            paddingHorizontal: 16,
            alignItems: 'center',
            paddingVertical: 8,
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: fonts.AnuphanMedium,
              color: colors.fontBlack,
            }}>
            {payload?.titleSheet || 'เลือกที่อยู่'}
          </Text>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={payload?.listData || []}
          keyExtractor={(_, index) => index.toString()}
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
                    SheetManager.hide(sheetId, {
                      payload: item,
                    });
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: colors.fontBlack,
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
};

export default SelectAddressSheet;

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
    backgroundColor: colors.grey5,
    width: '100%',
  },
});
