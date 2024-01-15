import React from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isVisible: boolean;
  children: React.ReactNode;
}
const PopUp = ({ isVisible, setIsVisible, children }: Props) => {
  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View>
      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={toggleModal}>
          <View style={styles.modalContent}>{children}</View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 5,
  },
});
export default PopUp;
