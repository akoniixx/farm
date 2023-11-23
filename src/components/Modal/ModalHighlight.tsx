import {
  Dimensions,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {colors} from '../../assets';
import icons from '../../assets/icons/icons';
import {mixpanel} from '../../../mixpanel';
import {promotionDatasource} from '../../datasource/PromotionDatasource';
import {useHighlight} from '../../contexts/HighlightContext';

export default function ModalHighlight() {
  const {
    highlightModal: {visible, uriImage, uriNavigation, id},
    onClose,
  } = useHighlight();
  const currentWidth = Dimensions.get('window').width - 32;
  const currentHeight = (5 / 4) * currentWidth;
  const onPressOpen = async () => {
    mixpanel.track('HighlightModal_Image_Pressed', {
      linkTo: uriNavigation,
    });
    try {
      await promotionDatasource.readHighlight(id);
      Linking.canOpenURL(uriNavigation).then(supported => {
        if (supported) {
          Linking.openURL(uriNavigation);
        } else {
          console.log("Don't know how to open URI: " + uriNavigation);
        }
        onClose();
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <>
              <Pressable
                onPress={() => {
                  onPressOpen();
                }}
                style={{
                  width: '100%',
                  marginBottom: 16,
                  height: 'auto',
                }}>
                <Image
                  source={{
                    uri: uriImage,
                  }}
                  style={{
                    width: currentWidth,
                    height: currentHeight,
                  }}
                />
              </Pressable>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.white,
                  borderRadius: 16,
                  padding: 8,
                }}>
                <Image
                  source={icons.close}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
});
