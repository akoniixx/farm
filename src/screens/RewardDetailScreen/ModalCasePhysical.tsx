import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import Modal from '../../components/Modal/Modal';
import Text from '../../components/Text/Text';
import Counter from '../../components/Counter/Counter';
import { colors, font } from '../../assets';
import { numberWithCommas } from '../../functions/utility';

type Props = {
  showCounter: boolean;
  setShowCounter: (value: boolean) => void;
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  isOverRemain?: boolean;
  notEnoughPoint?: boolean;
  requirePoint?: number;
  onPressPrimary?: () => void;
};

const ModalCasePhysical = ({
  counter,
  setCounter,
  setShowCounter,
  showCounter,
  isOverRemain = false,
  notEnoughPoint = false,
  requirePoint = 0,
  onPressPrimary,
}: Props) => {
  return (
    <>
      <Modal
        visible={showCounter}
        disablePrimary={counter === 0 || isOverRemain || notEnoughPoint}
        onPressPrimary={async () => {
          await onPressPrimary?.();
          setShowCounter(false);
        }}
        onPressSecondary={() => {
          setShowCounter(false);
        }}
        subButtonType="border"
        title={'จำนวนที่ต้องการแลก'}
        subTitle={
          <View
            style={{
              marginTop: 8,
              width: '100%',
            }}>
            <View style={styles.counter}>
              <View style={styles.box}>
                <Counter
                  currentCount={counter}
                  setCurrentCount={setCounter}
                  maximum={100}
                  minimum={0}
                  styleType="reward"
                  unitIncrement={1}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.textSarabun}>แต้มที่ใช้แลก</Text>
                <Text style={styles.textSarabunBold}>{`${numberWithCommas(
                  requirePoint.toString(),
                  true,
                )} แต้ม`}</Text>
              </View>
              {notEnoughPoint && (
                <View style={styles.row}>
                  <Text style={styles.textError}>แต้มของคุณไม่เพียงพอ</Text>
                </View>
              )}
            </View>
          </View>
        }
      />
    </>
  );
};

export default ModalCasePhysical;

const styles = StyleSheet.create({
  counter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: Dimensions.get('window').width * 0.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textSarabun: {
    fontFamily: font.SarabunRegular,
    fontSize: 18,
  },
  textSarabunBold: {
    fontFamily: font.SarabunSemiBold,
    fontSize: 18,
  },
  textError: {
    fontFamily: font.SarabunRegular,
    fontSize: 18,
    color: colors.errorText,
  },
});
