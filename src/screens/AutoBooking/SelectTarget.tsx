import React, { useState } from 'react';
import { View, Text } from 'react-native';

interface Props {
  options: string[];
  onValueChange: (value: string) => void;
  time: Array<object>;
}

const SelectTarget: React.FC<any> = (props: Props) => {
  return <View></View>;
};

export default SelectTarget;
