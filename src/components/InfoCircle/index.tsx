import {Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {SheetManager} from 'react-native-actions-sheet';
import {icons} from '../../assets';

export const SheetIDKey = {
  nicknameSheet: 'nicknameSheet',
};

interface Props {
  sheetId: keyof typeof SheetIDKey;
}
export default function InfoCircle({sheetId}: Props) {
  return (
    <TouchableOpacity
      onPress={async () => {
        await SheetManager.show(sheetId, {
          payload: {
            type: sheetId,
          },
        });
      }}>
      <Image
        resizeMode="contain"
        source={icons.infoCircleOrange}
        style={{
          width: 24,
          height: 24,
        }}
      />
    </TouchableOpacity>
  );
}
