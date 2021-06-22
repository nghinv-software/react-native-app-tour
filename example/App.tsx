/**
 * Created by nghinv on Tue Jun 22 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// @ts-ignore
import Switch from '@nghinv/react-native-switch';

function App() {
  const [enable, setEnable] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Switch on</Text>
        <Switch value={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Switch off</Text>
        <Switch value={false} />
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Switch disabled</Text>
        <Switch disabled value={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Switch size</Text>
        <Switch value={true} size={20} />
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Switch with trackColor</Text>
        <Switch
          trackColor={{
            true: 'tomato',
          }}
          thumbColor="orange"
          value={enable}
          onChange={(value: boolean) => setEnable(value)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Switch with thumbColor</Text>
        <Switch
          thumbColor="violet"
          value={enable}
          onChange={(value: boolean) => setEnable(value)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Switch onChange</Text>
        <Switch
          value={enable}
          onChange={(value: boolean) => setEnable(value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 16,
  },
});

export default App;
