/**
 * Created by nghinv on Wed Jun 23 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import Animated, { Easing, withSpring } from 'react-native-reanimated';
import type { NodesType, SceneType, TargetType } from './types';

export const springConfig = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export const timingConfig = {
  duration: 400,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export function getCurrentNode(
  nodes: Animated.SharedValue<NodesType>,
  scene: SceneType,
  currentStep: Animated.SharedValue<number>,
  defaultTarget: TargetType,
) {
  'worklet';

  const nodeId = scene[currentStep.value].id;
  const defaultNode = {
    target: defaultTarget,
    maskType: 'rect',
    title: '',
    describe: '',
  };

  return {
    node: nodes.value.find(n => n.id === nodeId) ?? defaultNode,
  };
}

export function withAnimation(
  value: number,
  animated = true,
) {
  'worklet';

  return animated ? withSpring(value, springConfig) : value;
}

// d="
// M cx cy
// m -r, 0
// a r,r 0 1,1 (r * 2),0
// a r,r 0 1,1 -(r * 2),0
// "
export function circlePathCalculator(
  cx: number,
  cy: number,
  r: number,
) {
  'worklet';

  return `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
}

export function circlePath(
  target: TargetType,
) {
  'worklet';

  const cx = (target.x.value + target.width.value / 2);
  const cy = (target.y.value + target.height.value / 2);
  const r = (Math.max(target.width.value, target.height.value) / 2);

  return circlePathCalculator(cx, cy, r);
}

export function rectPath(
  target: TargetType,
) {
  'worklet';

  const pathRects = [
    `M${target.x.value} ${target.y.value}`,
    `L${target.x.value} ${target.y.value + target.height.value}`,
    `L${target.x.value + target.width.value} ${target.y.value + target.height.value}`,
    `L${target.x.value + target.width.value} ${target.y.value}`,
    'Z',
  ];

  return pathRects.join(' ');
}

export function getRectPath(
  target: TargetType,
) {
  'worklet';

  const pathRects = [
    'M0 0',
    `L0 ${target.height.value}`,
    `L${target.width.value} ${target.height.value}`,
    `L${target.width.value} 0`,
    'Z',
  ];

  return pathRects.join(' ');
}
