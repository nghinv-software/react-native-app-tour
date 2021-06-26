/**
 * Created by nghinv on Fri Jun 18 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
// @ts-ignore
import { Icon } from '@nghinv/react-native-icons';
// @ts-ignore
import { AppTourStep, AppTour, useEvent } from '@nghinv/react-native-app-tour';
// @ts-ignore
import { useTheme } from '../themes/useTheme';
import { NODES } from './AppTourData';

function Page0() {
  const { theme } = useTheme();
  const scrollView = useRef<ScrollView>(null);
  const scrollAvatar = useSharedValue({ x: 0, y: 0 });

  const { addEventListener, removeEventListener } = useEvent();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollAvatar.value = {
      x: event.nativeEvent.contentOffset.x,
      y: event.nativeEvent.contentOffset.y,
    };
  };

  useEffect(() => {
    const id = addEventListener('AppTourEvent', (event: any) => {
      console.log('eventPage0', event.name, event.node?.id);
      if (event.node?.id === '9') {
        console.log('ID 9', event.node);
        scrollView.current?.scrollToEnd();
      }

      if (event.name === 'onPrevious' && event.node?.id === '3') {
        scrollView.current?.scrollTo({ y: 0, animated: true });
      }
    });

    return () => {
      removeEventListener(id);
    };
  }, []);

  const onStartAppTour = () => {
    AppTour.start();
  };

  return (
    <View style={styles.content}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scrollView}
      >
        <View style={styles.viewTitle}>
          <AppTourStep
            {...NODES[0]}
          >
            <Text style={theme.textStyles.h0}>
              {'Welcome to the demo of\n"React Native AppTour"'}
            </Text>
          </AppTourStep>
        </View>
        <View style={styles.viewAvatar}>
          <AppTourStep
            {...NODES[1]}
          >
            <Image style={styles.avatar} source={require('../assets/avatar.jpg')} resizeMode='cover' />
          </AppTourStep>
        </View>
        <View style={styles.viewInput}>
          <AppTourStep
            {...NODES[2]}
          >
            <TextInput
              style={styles.textInput}
              placeholder='Input your name'
              placeholderTextColor='grey'
            />
          </AppTourStep>
        </View>

        <TouchableOpacity onPress={onStartAppTour} style={styles.button}>
          <Text style={[theme.textStyles.h2, { color: 'white' }]}>Start App Tour</Text>
        </TouchableOpacity>
        <View style={[styles.viewAvatar, { marginTop: 420, marginBottom: 24 }]}>
          <AppTourStep
            {...NODES[8]}
            scrollTo={scrollAvatar}
          >
            <Image style={styles.avatar} source={require('../assets/avatar.jpg')} resizeMode='cover' />
          </AppTourStep>
        </View>
      </ScrollView>
    </View>
  );
}

function Page1() {
  const { theme } = useTheme();

  const onStartAppTour = () => {
    AppTour.start();
  };

  return (
    <View style={styles.content}>
      <View style={styles.viewTitle}>
        <AppTourStep
          {...NODES[5]}
        >
          <Text style={theme.textStyles.h0}>
            Demo title 2
          </Text>
        </AppTourStep>
      </View>
      <View style={styles.viewAvatar}>
        <AppTourStep
          {...NODES[6]}
        >
          <Image style={styles.avatar} source={require('../assets/avatar.jpg')} resizeMode='cover' />
        </AppTourStep>
      </View>
      <AppTourStep
        {...NODES[7]}
      >
        <TouchableOpacity onPress={onStartAppTour} style={styles.button}>
          <Text style={[theme.textStyles.h2, { color: 'white' }]}>Start App Tour</Text>
        </TouchableOpacity>
      </AppTourStep>
    </View>
  );
}

function AppTourScreen() {
  const { theme } = useTheme();
  const [page, setPage] = useState(0);
  const { addEventListener, removeEventListener } = useEvent();

  useEffect(() => {
    const id = addEventListener('AppTourEvent', (event: any) => {
      console.log('event', event.name);
    });

    return () => {
      removeEventListener(id);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>App Tour Screen</Text>
      </View>
      {
        page === 0 && <Page0 />
      }
      {
        page === 1 && <Page1 />
      }
      <View style={[styles.bottomBar, { backgroundColor: theme.card }]}>
        <AppTourStep
          {...NODES[3]}
        >
          <TouchableOpacity
            onPress={() => {
              setPage(0);
            }}
          >
            <View style={styles.viewIcon}>
              <Icon name='home' color='grey' />
            </View>
          </TouchableOpacity>
        </AppTourStep>
        <AppTourStep
          {...NODES[4]}
        >
          <TouchableOpacity
            onPress={() => {
              setPage(1);
            }}
          >
            <View style={styles.viewIcon}>
              <Icon name='photo' color='grey' />
            </View>
          </TouchableOpacity>
        </AppTourStep>
        <View style={styles.viewIcon}>
          <Icon name='room' color='grey' />
        </View>
        <View style={styles.viewIcon}>
          <Icon name='settings' color='grey' />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  viewIcon: {
    height: 54,
    width: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  viewAvatar: {
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 32,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  viewInput: {
    marginTop: 32,
    alignItems: 'center',
    paddingRight: 16,
  },
  textInput: {
    height: 54,
    width: 240,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 20,
  },
});

export default AppTourScreen;
