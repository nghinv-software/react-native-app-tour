/**
 * Created by nghinv on Fri Jun 18 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useEffect, useCallback } from 'react';
import { StyleSheet, StyleProp, ViewStyle, ViewProps } from 'react-native';
import equals from 'react-fast-compare';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

type TrackColorType = { false: string; true: string };

interface SwitchProps extends ViewProps {
  /**
   * Size of thumb default = 27
   */
  size?: number;
  /**
   * Color of the foreground switch grip.
   */
  thumbColor?: string;
  /**
   * Custom colors for the switch track
   *
   * Color when false and color when true
   */
  trackColor?: { false?: string | null; true?: string | null };
  /**
   * If true the user won't be able to toggle the switch.
   * Default value is false.
   */
  disabled?: boolean;
  /**
   * The value of the switch. If true the switch will be turned on.
   * Default value is false.
   */
  value?: boolean;
  /**
   * Invoked with the the change event as an argument when the value changes.
   */
  onChange?: (value: boolean) => void | null;

  style?: StyleProp<ViewStyle>;

  progress?: Animated.SharedValue<number>;
}

Switch.defaultProps = {
  size: 27,
  thumbColor: 'white',
  value: false,
  disabled: false,
};

const SpringConfigDefault = {
  mass: 1,
  damping: 15,
  stiffness: 120,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

const DefaultTrackColor = {
  true: '#31D158',
  false: 'rgba(120, 120, 120, 0.3)',
};

function Switch(props: SwitchProps) {
  const { value, thumbColor, disabled, onChange, style, ...rest } = props;
  const size = props.size as number;
  const trackColor = {
    ...DefaultTrackColor,
    ...props.trackColor,
  } as TrackColorType;
  const trackSize = size + 4;
  const trackWidth = size * 1.9;
  const progress = props.progress ?? useSharedValue(value ? 1 : 0);
  const thumbWidth = useSharedValue(size);
  const thumbTransX = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, SpringConfigDefault);
  }, [value]);

  const onChangeValue = useCallback(() => {
    onChange && onChange(!value);
  }, [value]);

  const onGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: () => {
        const newSize = size * 1.2;
        thumbWidth.value = withTiming(newSize);
        if (progress.value > 0.5) {
          thumbTransX.value = withTiming(size - newSize);
        }
      },
      onFinish: () => {
        thumbTransX.value = 0;
        thumbWidth.value = withTiming(size);
        const newValue = progress.value > 0.5 ? false : true;
        progress.value = withSpring(newValue ? 0 : 1, SpringConfigDefault);
        runOnJS(onChangeValue)();
      },
    });

  const trackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [trackColor.false, trackColor.true]
      ),
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      width: thumbWidth.value,
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, trackWidth - size - 4],
            Extrapolate.CLAMP
          ),
        },
        { translateX: thumbTransX.value },
      ],
    };
  });

  return (
    <TapGestureHandler
      enabled={!disabled && !!onChange}
      onGestureEvent={onGestureEvent}
    >
      <Animated.View
        {...rest}
        style={[
          {
            width: trackWidth,
            height: trackSize,
            borderRadius: trackSize / 2,
            opacity: disabled ? 0.5 : 1,
            justifyContent: 'center',
          },
          trackStyle,
          style,
        ]}
      >
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.thumb,
            {
              height: size,
              borderRadius: size / 2,
              backgroundColor: thumbColor,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  thumb: {
    position: 'absolute',
    left: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default React.memo(Switch, equals);
