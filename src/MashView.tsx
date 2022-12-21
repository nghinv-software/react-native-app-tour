/**
 * Created by nghinv on Wed Jun 23 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useContext } from 'react';
import { View, StyleSheet, useWindowDimensions, LayoutChangeEvent, Platform, TouchableOpacity } from 'react-native';
import equals from 'react-fast-compare';
import { Svg, Defs, Rect, Circle, Mask } from 'react-native-svg';
import AnimateableText from 'react-native-animateable-text';
import { TapGestureHandler, TapGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { interpolate, interpolateColor, runOnJS, useAnimatedGestureHandler, useAnimatedProps, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { AppTourContext } from './AppTourContext';
import { useEvent, useVectorLayout } from './hook';
import { getCurrentNode, withAnimation } from './math';
import MenuButton from './MenuButton';
import type { SceneType } from './types';

const RectAnimated = Animated.createAnimatedComponent(Rect);
const CircleAnimated = Animated.createAnimatedComponent(Circle);

interface MashViewProps {
  currentStep: Animated.SharedValue<number>;
  progress: Animated.SharedValue<number>;
  onStop: () => void;
  open: (step?: number) => void;
  scene: SceneType;
}

const IS_IOS = Platform.OS === 'ios';

function MashView(props: MashViewProps) {
  const { progress, currentStep, scene, onStop } = props;
  const { nodes, options } = useContext(AppTourContext);
  const { emitEvent } = useEvent();
  const defaultTarget = useVectorLayout();
  const dimension = useWindowDimensions();
  const contentHeight = useSharedValue(0);
  const contentWidth = useSharedValue(0);
  const activeNode = useSharedValue(0);
  const TriangleHeight = options?.triangleHeight ?? 8;
  const StepHeight = options?.stepHeight ?? 20;
  const pathAnimated = options?.pathAnimated ?? IS_IOS;

  const onNextStep = () => {
    const nextValue = currentStep.value + 1;
    const sceneLength = scene.length;

    if (nextValue <= sceneLength - 1) {
      const currentScene = scene[nextValue];
      currentStep.value = nextValue;

      emitEvent('AppTourEvent', {
        name: 'onNext',
        step: nextValue,
        node: nodes.value.find(n => n.id === currentScene.id),
        scene: currentScene,
      });
    } else {
      onStop();
    }
  };

  const onPressNode = () => {
    const currentScene = scene[currentStep.value];
    const node = nodes.value.find(n => n.id === currentScene.id);

    if (currentScene.enablePressNode) {
      node?.onPress?.();
    }

    if (currentScene.pressToNext) {
      emitEvent('AppTourEvent', {
        name: 'onPressNode',
        step: currentStep.value,
        node,
        scene: currentScene,
      });

      if (currentScene.nextDelay) {
        setTimeout(() => {
          onNextStep();
        }, currentScene.nextDelay);
      } else {
        onNextStep();
      }
    }
  };

  const onGestureEventNode = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onActive: () => {
      runOnJS(onPressNode)();
    },
    onStart: () => {
      const currentScene = scene[currentStep.value];
      if (currentScene.enablePressNode) {
        activeNode.value = withAnimation(1);
      }
    },
    onFinish: () => {
      const currentScene = scene[currentStep.value];
      if (currentScene.enablePressNode) {
        activeNode.value = withAnimation(0);
      }
    },
  });

  const onContentLayout = (event: LayoutChangeEvent) => {
    contentHeight.value = event.nativeEvent.layout.height;
    contentWidth.value = event.nativeEvent.layout.width;
  };

  const animatedPropsBackdrop = useAnimatedProps(() => {
    return {
      //fill: interpolateColor(progress.value, [0, 1], ['rgba(0, 0, 0, 0)', `rgba(0, 0, 0, ${options?.backdropOpacity ?? 0.8})`]),
      fillOpacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  const animatedPropsMaskCircle = useAnimatedProps(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { target, maskType } = node;

    return {
      cx: withAnimation(target.x.value + target.width.value / 2, pathAnimated),
      cy: withAnimation(target.y.value + target.height.value / 2, pathAnimated),
      r: maskType === 'circle' ? withAnimation(Math.max(target.width.value, target.height.value) / 2, pathAnimated) : 0,
    };
  });

  const animatedPropsMaskRect = useAnimatedProps(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { target, maskType } = node;

    return {
      x: withAnimation(target.x.value, pathAnimated),
      y: withAnimation(target.y.value, pathAnimated),
      width: maskType !== 'circle' ? withAnimation(target.width.value, pathAnimated) : 0,
      height: maskType !== 'circle' ? withAnimation(target.height.value, pathAnimated) : 0,
    };
  });

  const childrenStyle = useAnimatedStyle(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { target } = node;

    return {
      width: target.width.value,
      height: target.height.value,
      borderRadius: target.height.value,
      backgroundColor: interpolateColor(activeNode.value, [0, 1], ['transparent', options?.colorNodeOnPress ?? 'rgba(255, 255, 255, 0.8)']),
      transform: [
        { translateX: target.x.value },
        { translateY: target.y.value },
        { scale: interpolate(activeNode.value, [0, 1], [1, 1.2]) },
      ],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { target } = node;
    const isTargetTopScreen = target.y.value + target.height.value < dimension.height / 2;
    const translateY = isTargetTopScreen ? withAnimation(target.y.value + target.height.value + TriangleHeight)
      : withAnimation(target.y.value - contentHeight.value - TriangleHeight);

    const isOverScreen = contentWidth.value + target.x.value > dimension.width - 32;
    const delta = (dimension.width - contentWidth.value) / 2;
    const translateX = isOverScreen ? withAnimation(Math.max(0, delta)) : withAnimation(target.x.value);

    return {
      opacity: interpolate(progress.value, [0, 0.9, 1], [0, 0, 1]),
      transform: [
        { translateX },
        { translateY },
        { scale: interpolate(progress.value, [0, 1], [0.6, 1]) },
      ],
    };
  });

  const triangleStyle = useAnimatedStyle(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { target, maskType } = node;
    const isTargetTopScreen = target.y.value + target.height.value < dimension.height / 2;
    const isOverScreen = contentWidth.value + target.x.value > dimension.width - 32;
    const delta = (dimension.width - contentWidth.value) / 2;
    const originTranslateX = isOverScreen ? Math.max(0, delta) : target.x.value;
    const translateY = isTargetTopScreen ? -TriangleHeight : contentHeight.value;
    const translateX = maskType === 'circle' ? withAnimation(target.x.value + target.width.value / 2 - originTranslateX - TriangleHeight) : withAnimation(target.x.value - originTranslateX + 12);

    return {
      transform: [
        { translateY },
        { translateX },
        { rotate: isTargetTopScreen ? '0deg' : '180deg' },
      ],
    };
  });

  const stepStyle = useAnimatedStyle(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { target } = node;
    const translateX = target.x.value < 32 ? target.x.value + target.width.value - StepHeight / 2 : target.x.value - StepHeight / 2;
    const translateY = target.y.value - StepHeight / 2;

    return {
      transform: [
        { translateX },
        { translateY },
      ],
    };
  });

  const animatedPropsStep = useAnimatedProps(() => {
    return {
      text: `${currentStep.value + 1}`,
    };
  });

  const animatedPropsTitle = useAnimatedProps(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { title } = node;

    return {
      text: title,
    };
  });

  const animatedPropsDescribe = useAnimatedProps(() => {
    const { node } = getCurrentNode(nodes, scene, currentStep, defaultTarget);
    const { describe } = node;

    return {
      text: describe,
    };
  });

  return (
    <View pointerEvents='box-none' style={styles.container}>
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="mask" x="0" y="0" height="100%" width="100%">
            <Rect height="100%" width="100%" fill="#fff" />
            <CircleAnimated
              animatedProps={animatedPropsMaskCircle}
              fill='black'
            />
            <RectAnimated
              animatedProps={animatedPropsMaskRect}
              fill='black'
            />
          </Mask>
        </Defs>
        <RectAnimated
          animatedProps={animatedPropsBackdrop}
          height="100%"
          width="100%"
          fill={`rgba(0,0,0,${options?.backdropOpacity || 0.8})`}
          mask="url(#mask)"
          fill-opacity="0"
        />
      </Svg>
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: options?.backgroundColor ?? 'white',
            borderRadius: options?.borderRadius ?? 5,
          },
          contentStyle,
        ]}
        onLayout={onContentLayout}
      >
        <Animated.View
          style={[
            styles.triangle,
            {
              borderBottomColor: options?.backgroundColor ?? 'white',
              borderLeftWidth: TriangleHeight,
              borderRightWidth: TriangleHeight,
              borderBottomWidth: TriangleHeight,
            },
            triangleStyle,
          ]}
        />
        <View style={styles.viewTitle}>
          {
            options?.titleShow !== false && (
              <AnimateableText
                style={[styles.txtTitle, options?.titleStyle]}
                animatedProps={animatedPropsTitle}
              />
            )
          }
          <AnimateableText
            style={[styles.txtDescribe, options?.describeStyle]}
            animatedProps={animatedPropsDescribe}
          />
        </View>
        <MenuButton
          currentStep={currentStep}
          onStop={onStop}
        />
      </Animated.View>
      {
        options?.stepShow !== false && (
          <Animated.View
            style={[
              styles.stepView,
              {
                backgroundColor: options?.stepBackgroundColor ?? 'green',
                height: StepHeight,
                minWidth: StepHeight,
                borderRadius: StepHeight / 2,
              },
              stepStyle,
            ]}
          >
            <AnimateableText
              style={[styles.txtStep, { color: options?.stepTitleColor ?? 'white' }]}
              animatedProps={animatedPropsStep}
            />
          </Animated.View>
        )
      }
      <TapGestureHandler
        onGestureEvent={onGestureEventNode}
        enabled={!options?.nativeModal}
      >
        <Animated.View
          style={[styles.children, childrenStyle]}
        >
          {
            options?.nativeModal && <TouchableOpacity onPress={onPressNode} style={styles.childrenButton} />
          }
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  children: {
    position: 'absolute',
    overflow: 'hidden',
  },
  stepView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 4,
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderStyle: 'solid',
  },
  content: {
    position: 'absolute',
    minWidth: 180,
  },
  viewTitle: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    zIndex: 1,
  },
  txtTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  txtDescribe: {
    fontSize: 16,
  },
  txtStep: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
  },
  childrenButton: {
    flex: 1,
  },
});

export default React.memo(MashView, equals);
