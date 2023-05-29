import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {colors, font, icons} from '../../assets';
interface Branch {
  createdAt: string;
  id: string;
  isActive: boolean;
  name: string;
  nameEn: string | null;
  updatedAt: string;
}
export default function SheetSelectArea(props: SheetProps) {
  const [selectedArea, setSelectedArea] = React.useState<any>();
  const [listBranch, setListBranch] = React.useState<Branch[]>([]);
  useEffect(() => {
    if (props?.payload?.selected) {
      setSelectedArea(props.payload.selected);
    }
    if (props.payload.data) {
      setListBranch(props.payload.data);
    }
  }, [props.payload]);
  return (
    <ActionSheet
      useBottomSafeAreaPadding
      //   onClose={async () => {
      //     await SheetManager.hide(props.sheetId, {
      //       payload: {
      //         selected: selectedArea,
      //       },
      //     });
      //   }}
      closeOnTouchBackdrop={false}
      id={props.sheetId}
      containerStyle={{
        height: '70%',
      }}>
      <View style={styles.container}>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: 20,
          }}>
          เลือกสาขาที่ใช้สิทธิ์ส่วนลด
        </Text>
        <Text
          style={{
            fontFamily: font.medium,
            fontSize: 18,
            color: colors.decreasePoint,
          }}>
          เฉพาะเจ้าหน้าที่เท่านั้น
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingLeft: 16,
        }}
        data={listBranch}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectedArea(item)}
              style={styles.list}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                }}>
                {item.name}
              </Text>
              {selectedArea?.id === item.id && (
                <Image
                  source={icons.checkFillSuccess}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />
      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: 16,
            borderBottomWidth: 0,
          },
        ]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('done');
          }}>
          <Text style={styles.textButton}>ยืนยันการใช้</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.subButton}
          onPress={async () => {
            await SheetManager.hide(props.sheetId, {
              payload: {
                selected: selectedArea,
              },
            });
          }}>
          <Text style={styles.textSubButton}>ยกเลิก</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderBottomWidth: 1,
    borderColor: colors.disable,
    paddingBottom: 16,
  },
  footer: {
    paddingVertical: 16,
    backgroundColor: colors.white,

    elevation: 8,
    shadowColor: '#242D35',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  list: {
    width: '100%',
    paddingVertical: 16,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.disable,
  },
  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: colors.darkBlue,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 16,
  },
  textSubButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.fontBlack,
  },
  subButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});
