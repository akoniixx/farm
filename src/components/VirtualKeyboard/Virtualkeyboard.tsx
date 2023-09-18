import React, {Component, useState} from 'react';

import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';

import {icons} from '../../assets';
import Text from '../Text';

const BACK = 'back';
const CLEAR = 'clear';
const PRESS_MODE_STRING = 'string';

interface props {
  value: string;
  onChange: (v: string) => void;
}

const VirtualKeyboard: React.FC<props> = ({value, onChange}) => {
  /* const [text, setText] = useState('');
   */
  const onPress = (val: any) => {
    let curText = value;
    if (isNaN(val)) {
      if (val === BACK) {
        curText = curText.slice(0, -1);
      } else if (val === CLEAR) {
        curText = '';
      } else {
        curText += val;
      }
    } else {
      curText += val;
    }
    onChange(curText);
  };

  const Row = (numbersArray: number[]) => {
    let cells = numbersArray.map(val => Cell(val));
    return <View style={[styles.row]}>{cells}</View>;
  };

  const Backspace = () => {
    return (
      <TouchableOpacity
        accessibilityLabel="backspace"
        style={styles.backspace}
        onPress={() => {
          onPress(BACK);
        }}
        /* onLongPress={() => { if(this.props.clearOnLongPress) this.onPress(CLEAR) }} */
      >
        <Image
          source={icons.deleteIcon}
          resizeMode="contain"
          style={{tintColor: 'gray'}}
        />
      </TouchableOpacity>
    );
  };

  const Cell = (symbol: any) => {
    return (
      <TouchableOpacity
        style={[styles.cell]}
        key={symbol}
        accessibilityLabel={symbol.toString()}
        onPress={() => {
          onPress(symbol.toString());
        }}>
        <Text style={[styles.number]}>{symbol}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container]}>
      {Row([1, 2, 3])}
      {Row([4, 5, 6])}
      {Row([7, 8, 9])}
      <View style={[styles.row]}>
        <View style={{flex: 1}} />
        {Cell(0)}
        {Backspace()}
      </View>
    </View>
  );
};

export default VirtualKeyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    marginTop: 15,
  },
  number: {
    fontSize: 25,
    textAlign: 'center',
  },
  backspace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
});
