import { Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { icons } from '../../assets';
import { SheetManager } from 'react-native-actions-sheet';

interface Props {
  sheetId: 'placePlot' | 'positionPlot' | 'targetSpray' | 'injectTime';
}

export default function InfoCircleButton({ sheetId }: Props) {
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
        source={icons.infoCircle}
        style={{
          width: 24,
          height: 24,
        }}
      />
    </TouchableOpacity>
  );
}
