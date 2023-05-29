import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';

import CollapseItem from './CollapseItem';

export default function Body() {
  const array = [1, 2, 3, 4, 5];

  return (
    <View>
      <ScrollView style={styles.container}>
        {array.map((item, index) => {
          return <CollapseItem />;
        })}
        <View style={{height: 200}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    padding: 16,
  },
});
