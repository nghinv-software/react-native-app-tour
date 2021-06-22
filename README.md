# @nghinv/react-native-switch

React Native Switch Library

---


[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]
[![All Contributors][all-contributors-badge]][all-contributors]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]


## Installation

```sh
npm install @nghinv/react-native-switch
```

or 

```sh
yarn add @nghinv/react-native-switch
```

## Usage

```js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Switch from '@nghinv/react-native-switch';

function App() {
  const [enable, setEnable] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Switch</Text>
        <Switch 
          value={enable} 
          onChange={(value) => setEnable(value)} 
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
```

## License

MIT

[build-badge]: https://img.shields.io/circleci/project/github/callstack/react-native-paper/main.svg?style=flat-square
[build]: https://circleci.com/gh/callstack/react-native-paper
[version-badge]: https://img.shields.io/npm/v/@nghinv/react-native-switch.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nghinv/react-native-switch
[license-badge]: https://img.shields.io/npm/l/@nghinv/react-native-switch.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[all-contributors]: #contributors
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
