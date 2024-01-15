import { Image, StyleSheet } from 'react-native';
import React from 'react';
import Modal from '../../components/Modal/Modal';
import { mixpanel } from '../../../mixpanel';
import { DigitalRewardType, RewardListType } from '../../types/RewardType';
import { icons } from '../../assets';

type Props = {
  navigation: any;
  isConfirm: boolean;
  setIsConfirm: (value: boolean) => void;
  disableExchange: boolean;
  id: string;
  rewardDetail: RewardListType;
  onRedeemDigital: () => Promise<void>;
  showSuccessExchangeModal: boolean;
  setShowSuccessExchangeModal: (value: boolean) => void;
  resultRedeemDigital: DigitalRewardType;
};

const ModalCaseDigital = ({
  navigation,
  isConfirm,
  setIsConfirm,
  disableExchange,
  id,
  rewardDetail,
  onRedeemDigital,
  showSuccessExchangeModal,
  setShowSuccessExchangeModal,
  resultRedeemDigital,
}: Props) => {
  return (
    <>
      <Modal
        visible={isConfirm}
        disablePrimary={disableExchange}
        onPressPrimary={async () => {
          mixpanel.track('RewardDetailScreen_ConfirmButtonDigital_press', {
            rewardId: id,
            rewardName: rewardDetail.rewardName,
            rewardType: rewardDetail.rewardType,
            rewardScore: rewardDetail.score,
            rewardAmount: 1,
          });
          try {
            setIsConfirm(false);
            await onRedeemDigital();
          } catch (error) {
            console.log(error);
          }
        }}
        title={'ยืนยันการแลก'}
        onPressSecondary={() => {
          mixpanel.track('RewardDetailScreen_CancelButtonDigital_press');
          setIsConfirm(false);
        }}
        subTitle={'ท่านต้องการยืนยันการแลกหรือไม่'}
      />
      <Modal
        showClose
        onClose={() => {
          mixpanel.track('RewardDetailScreen_SuccessExchangeModal_close');
          setShowSuccessExchangeModal(false);
        }}
        iconTop={
          <Image
            source={icons.correct}
            style={{ width: 24, height: 24, marginBottom: 16 }}
          />
        }
        visible={showSuccessExchangeModal}
        onPressPrimary={() => {
          mixpanel.track('RewardDetailScreen_SuccessExchangeModal_press', {
            to: 'RedeemDetailDigitalScreen',
          });
          setShowSuccessExchangeModal(false);
          navigation.navigate('RedeemDetailDigitalScreen', {
            data: resultRedeemDigital,
            imagePath: rewardDetail.imagePath,
            expiredUsedDate: rewardDetail.expiredUsedDate,
          });
        }}
        onPressSecondary={() => {
          mixpanel.track('กดยังไม่ใช้คูปองหลังจากแลกรางวัล');
          setShowSuccessExchangeModal(false);
          navigation.navigate('MyRewardScreen', {
            tab: 'readyToUse',
          });
        }}
        title={'การแลกสำเร็จ'}
        subTitle={'คูปองพร้อมใช้งานแล้ว'}
        titlePrimary="ใช้คูปอง"
        titleSecondary="ดูรางวัลของฉัน"
        subButtonType="border"
      />
    </>
  );
};

export default ModalCaseDigital;

const styles = StyleSheet.create({});
