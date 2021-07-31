# @nghinv/react-native-app-tour

React Native App Tour Library

---

[![CircleCI](https://circleci.com/gh/nghinv-software/react-native-app-tour.svg?style=svg)](https://circleci.com/gh/nghinv-software/react-native-app-tour)
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]


<p align="center">
  <img src="./assets/demo.gif" height="600"/>
</p>

## Installation

```sh
yarn add @nghinv/react-native-app-tour
```
or 

```sh
npm install @nghinv/react-native-app-tour
```

```sh
yarn add react-native-gesture-handler react-native-reanimated react-native-animateable-text react-native-svg
```

> IOS run `cd ios && pod install`

## Usage

1. Wrapper `AppTourProvider` in the `Root` Component

```js
import { AppTourProvider } from '@nghinv/react-native-app-tour';

...
render() {
  return (
    <AppTourProvider
      sceneIndex={0}
      scenes={[
        [
          { 
            id: '1',
            nextDelay: 50,
            pressToNext: true,
            enablePressNode: true,
            prevDisable: true,
          }, 
          { id: '2' },
        ],
        [
          { id: '2' }, 
          { id: '1' },
        ],
      ]}
      options={{
        buttonTitleColor: {
          next: 'red',
          prev: 'orange',
        },
        borderRadius: 5,
        colorNodeOnPress: 'tomato',
        ...otherOptionsProps,
      }}
    >
      <Root />
    </AppTourProvider>
  )
}
...
```

2. Use `AppTourStep`

```js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppTourStep, useAppTour, AppTour, useEvent } from '@nghinv/react-native-app-tour';

export function App() {
  const { addEventListener, removeEventListener } = useEvent();

  useEffect(() => {
    // Listener AppTour Event
    const id = addEventListener('AppTourEvent', (event) => {
      console.log('AppTourEvent', event.name, event.node?.id);

    return () => {
      removeEventListener(id);
    };
  }, []);

  const onStartAppTour = () => {
    // Start show AppTour
    // Use AppTour.start(step) to jump to step
    AppTour.start();
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.viewTitle}>
        <AppTourStep
          id='1'
          title='Text welcome'
          describe='This is welcome title app'
        >
          <Text>
            {'Welcome to the demo of\n"React Native AppTour"'}
          </Text>
        </AppTourStep>
      </View>
      <View style={styles.viewAvatar}>
        <AppTourStep
          id='2'
          title='avatar'
          describe='Press here to change your avatar'
        >
          <Image 
            style={styles.avatar} 
            source={require('../assets/avatar.jpg')} 
            resizeMode='cover' 
          />
        </AppTourStep>
      </View>

      <TouchableOpacity 
        onPress={onStartAppTour} 
        style={styles.button}
      >
        <Text>Start App Tour</Text>
      </TouchableOpacity>
    </View>
  )
}
```

## Property

### AppTourProvider

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| sceneIndex | `number` | `0` | Index of scenes |
| scenes | `Array<Array<SceneProperty>>` | `[]` | Index of scenes |
| options | `OptionsProperty` | `undefined` | Custom app tour props |


* SceneProperty 

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| id | `string` |  | ID of AppTourStep |
| nextDelay | `number` | `undefined` | unit: ms |
| prevDelay | `number` | `undefined` | unit: ms |
| pressToNext | `boolean` | `false` | Press to Element to next step |
| enablePressNode | `boolean` | `false` |  |
| nextDisable | `boolean` | `false` | disable next step button |
| prevDisable | `boolean` | `false` | disable prev step button |


* OptionsProperty

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| nativeModal | `boolean` | `false` | Use Modal from react native |
| backdropOpacity | `number` | `0.8` | value from 0 to 1 |
| backgroundColor | `string` | `undefined` | backgroundColor of content |
| borderRadius | `number` | `5` | borderRadius of content |
| titleShow | `boolean` | `true` |  |
| titleStyle | `TextStyle` | `undefined` |  |
| describeStyle | `TextStyle` | `undefined` |  |
| stepShow | `boolean` | `true` |  |
| stepTitleColor | `string` | `white` |  |
| stepBackgroundColor | `string` | `green` |  |
| pathAnimated | `boolean` | `true` | Default set pathAnimated = false on Android |
| stepHeight | `number` | `20` |  |
| triangleHeight | `number` | `8` |  |
| colorNodeOnPress | `string` | `rgba(255, 255, 255, 0.8)` |  |
| backAndroidToSkip | `boolean` | `false` | Enable skip AppTour on backAndroid press |
| debug | `boolean` | `false` | Show debug |
| buttonTitle | `ButtonTitleProps` | `undefined` |  |
| buttonTitleColor | `ButtonTitleColorProps` | `undefined` |  |


* ButtonTitleProps

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| skip | `string` | `Skip` |  |
| prev | `string` | `Previous` |  |
| next | `string` | `Next` |  |
| finish | `string` | `Finish` |  |


* ButtonTitleColorProps

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| skip | `string` | `green` |  |
| prev | `string` | `green` |  |
| next | `string` | `green` |  |
| finish | `string` | `green` |  |


<br/>

### AppTourStep

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| id | `string` |  | ID of Element |
| title | `string` |  |  |
| describe | `string` |  |  |
| maskType | `circle \| rect` | `rect` |  |
| scrollTo | `Animated.SharedValue<ScrollToXY>` |  |  |

* ScrollToXY

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| x | `number` |  |  |
| y | `number` |  |  |

### AppTour

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| start | `(step?: number) => void` |  | Start show AppTour |
| stop | `(cb?: () => void) => void` |  | Stop AppTour |
| nextStep | `() => void` |  | Next step AppTour |
| preStep | `() => void` |  | Previous step AppTour |
| currentStep | `() => number` |  | Get current step |

### useAppTour

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| setSceneIndex | `React.Dispatch<React.SetStateAction<number>>` |  | Set scenes index |


### useEvent

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| addEventListener | `(eventName: 'AppTourEvent', callback: (data: EventData) => void) => string` |  |  |
| removeEventListener | `(id: string) => boolean` |  |  |


* EventData

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| name | `onStart\|onStop\|onFinish\|onSkip\|onNext\|onPrevious\| onPressNode` |  |  |
| step | `number` |  |  |
| node | `NodeType` |  |  |
| scene | `SceneType` |  |  |

---
## Credits

- [@Nghi-NV](https://github.com/Nghi-NV)

[version-badge]: https://img.shields.io/npm/v/@nghinv/react-native-app-tour.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nghinv/react-native-app-tour
[license-badge]: https://img.shields.io/npm/l/@nghinv/react-native-app-tour.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[all-contributors]: #contributors
[install-size-name]: https://packagephobia.now.sh/badge?p=@nghinv/react-native-app-tour
[install-size]: https://packagephobia.now.sh/badge?p=@nghinv/react-native-app-tour
[download-name]: https://www.npmjs.com/package/@nghinv/react-native-app-tour
[download-size]: https://img.shields.io/npm/dm/@nghinv/react-native-app-tour.svg?style=flat-square

