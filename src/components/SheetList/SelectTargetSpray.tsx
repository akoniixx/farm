import {
  Animated,
  Dimensions,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import Text from '../Text/Text';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';
import { targetSprayDatasource } from '../../datasource/TargetSprayDatasource';
import { mixpanel } from '../../../mixpanel';
import { normalize } from '../../functions/Normalize';
import InputWithSuffix from '../InputText/InputWithSuffix';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MainButton } from '../Button/MainButton';

interface Props {
  sheetId: string;
  payload: {
    targetSpray: string[];
  };
}
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SelectTargetSpray({ sheetId, payload }: Props) {
  const [listTargetSpray, setListTargetSpray] = React.useState<string[]>([]);
  const [otherPlant, setOtherPlant] = React.useState<string>('');
  const [currentVal, setCurrentVal] = React.useState<string[]>([]);
  const [isInputFocused, setInputFocused] = React.useState(false);

  const onFocusInput = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setInputFocused(true);
  };

  const onBlurInput = async () => {
    await setTimeout(() => {
      setInputFocused(false);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }, 800);
  };

  useEffect(() => {
    const getListTargetSpray = async () => {
      const result = await targetSprayDatasource.getTargetSpray();
      const newFormat = result.data.map((item: { name: string }) => item.name);
      setListTargetSpray(newFormat);
    };
    getListTargetSpray().then(() => {
      setCurrentVal(payload.targetSpray);
    });
  }, [payload.targetSpray]);
  return (
    <ActionSheet
      id={sheetId}
      containerStyle={{
        height: '100%',
      }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView extraScrollHeight={100}>
          <View style={{ flex: 1, alignItems: 'center' }}>
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
                  color: colors.fontBlack,
                }}>
                เป้าหมาย
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (currentVal?.length > 0) {
                    SheetManager.hide(sheetId, {
                      payload: {
                        targetSpray: currentVal,
                      },
                    });
                  } else {
                    SheetManager.hide(sheetId, {
                      payload: {
                        targetSpray: payload.targetSpray,
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
            <View style={styles.headerSection}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.SarabunLight,
                  color: colors.fontBlack,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}>
                เลือกอย่างน้อย 1 ข้อ
              </Text>
            </View>
            <FlatList
              style={{
                width: '100%',
                paddingHorizontal: 16,
                paddingBottom: 32,
              }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <InputWithSuffix
                  onBlur={onBlurInput}
                  onFocus={onFocusInput}
                  styleContainer={{
                    marginTop: 16,
                  }}
                  value={otherPlant}
                  placeholder="เป้าหมายอื่นๆ เช่น เพลีย หนอน"
                  onChangeText={text => {
                    const removeSpaceFront = text.replace(/^\s+/, '');
                    setOtherPlant(removeSpaceFront);
                  }}
                  suffixComponent={
                    otherPlant && (
                      <TouchableOpacity
                        onPress={() => {
                          if (currentVal.includes(otherPlant)) {
                            return;
                          }
                          setListTargetSpray(prev => [...prev, otherPlant]);

                          mixpanel.track(
                            'SelectTargetScreen_AddTarget_tabbed',
                            {
                              otherPlant: otherPlant,
                            },
                          );
                          setCurrentVal(prev => [...prev, otherPlant]);
                          setOtherPlant('');
                        }}
                        style={{
                          backgroundColor: '#56D88C',
                          width: 60,
                          height: 35,
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: colors.white,
                            fontSize: 18,
                            fontFamily: fonts.AnuphanMedium,
                          }}>
                          เพิ่ม
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                />
              }
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              data={listTargetSpray}
              numColumns={2}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.card,
                      {
                        backgroundColor:
                          item && currentVal.includes(item.toString())
                            ? '#ECFBF2'
                            : '#F2F3F4',
                        borderWidth: 1,
                        borderColor:
                          item && currentVal.includes(item.toString())
                            ? colors.greenLight
                            : '#F2F3F4',
                      },
                    ]}
                    onPress={() => {
                      mixpanel.track('SelectTargetScreen_SelectTarget_tabbed', {
                        target: item,
                      });
                      if (currentVal.includes(item.toString())) {
                        setCurrentVal(prev => {
                          const result = prev.filter(
                            itemFilter => itemFilter !== item,
                          );
                          return result;
                        });
                      } else {
                        setCurrentVal(prev => [...prev, item]);
                      }
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.SarabunLight,
                        lineHeight: 28,
                        color:
                          item && currentVal.includes(item.toString())
                            ? colors.greenDark
                            : colors.fontBlack,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      {!isInputFocused && (
        <Animated.View
          style={[
            styles.footer,
            { height: isInputFocused ? 0 : 'auto', overflow: 'hidden' },
          ]}>
          <TouchableOpacity
            disabled={currentVal?.length === 0}
            onPress={() => {
              setCurrentVal([]);
            }}
            style={
              currentVal?.length === 0
                ? styles.disableClearButton
                : styles.clearButton
            }>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanBold,
                color:
                  currentVal?.length === 0 ? colors.disable : colors.fontBlack,
              }}>
              ล้างตัวเลือก
            </Text>
          </TouchableOpacity>
          <MainButton
            disable={currentVal?.length === 0}
            color={colors.greenLight}
            label="ยืนยัน"
            width={Dimensions.get('window').width / 2 - 24}
            onPress={() => {
              if (currentVal?.length > 0) {
                SheetManager.hide(sheetId, {
                  payload: {
                    targetSpray: currentVal,
                  },
                });
              } else {
                SheetManager.hide(sheetId, {
                  payload: {
                    targetSpray: payload.targetSpray,
                  },
                });
              }
            }}
          />
        </Animated.View>
      )}
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerSection: {
    alignItems: 'flex-start',
    width: '100%',
  },
  card: {
    width: '48%',
    height: normalize(42),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(10),
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  clearButton: {
    width: Dimensions.get('window').width / 2 - 24,
    height: 57,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.fontBlack,
  },
  disableClearButton: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width / 2 - 24,
    height: 57,

    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.disable,
    borderWidth: 1,
  },
});
