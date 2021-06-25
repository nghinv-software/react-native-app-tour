/**
 * Created by nghinv on Sat Jun 19 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle, TouchableOpacityProps, TextProps, Text } from 'react-native';
import equals from 'react-fast-compare';
import type { ButtonComponentProps } from './types';

export interface ButtonTextProps {
  title?: string;
  titleColor?: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: TextStyle;
  buttonProps?: TouchableOpacityProps;
  titleProps?: TextProps;
}

function ButtonText(props: ButtonTextProps) {
  const {
    title,
    disabled,
    onPress,
    style,
    titleStyle,
    buttonProps,
    titleProps,
    titleColor = 'green',
  } = props;
  const ButtonComponent: ButtonComponentProps = (disabled || !onPress) ? View : TouchableOpacity;

  return (
    <ButtonComponent
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      {...buttonProps}
      onPress={onPress}
      style={[styles.container, { opacity: disabled ? 0.6 : 1 }, style]}
    >
      <Text {...titleProps} style={[styles.title, { color: titleColor }, titleStyle]}>{title}</Text>
    </ButtonComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default React.memo(ButtonText, equals);
