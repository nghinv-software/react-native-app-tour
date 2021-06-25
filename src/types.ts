/**
 * Created by nghinv on Wed Jun 23 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */
import type React from 'react';
import type { TextStyle, TouchableOpacity, View } from 'react-native';
import type Animated from 'react-native-reanimated';

export type ButtonComponentProps = React.ElementType & (typeof TouchableOpacity | typeof View);

export type MaskType = 'circle' | 'rect';

export type LayoutType = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TargetType = {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  width: Animated.SharedValue<number>;
  height: Animated.SharedValue<number>;
}

export type Vector = {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
}

export type NodeType = {
  id: string;
  title: string;
  describe: string;
  maskType?: MaskType;
  onPress?: () => void;
  target: TargetType;
};

export type NodesType = Array<NodeType>;

export type AppTourStep = {
  id: string;
  title: string;
  describe: string;
  maskType?: MaskType;
}

export type ScrollToXY = {
  x: number;
  y: number;
}

export type AppTourStepType = {
  children: React.ReactElement;
  scrollTo?: Animated.SharedValue<ScrollToXY>;
} & AppTourStep;

export type OptionType = {
  nativeModal?: boolean;
  buttonTitle?: {
    skip?: string;
    prev?: string;
    next?: string;
    finish?: string;
  },
  buttonTitleColor?: {
    skip?: string;
    prev?: string;
    next?: string;
    finish?: string;
  };
  // Overlay opacity 0 - 1
  backdropOpacity?: number;
  // Default white
  backgroundColor?: string;
  // Default = 5
  borderRadius?: number;
  titleShow?: boolean;
  titleStyle?: TextStyle;
  describeStyle?: TextStyle;
  stepShow?: boolean;
  stepTitleColor?: string;
  stepBackgroundColor?: string;
  pathAnimated?: boolean;
  // Default = 20
  stepHeight?: number;
  // Default 8
  triangleHeight?: number;
  // Default = rgba(255, 255, 255, 0.8). Need set enablePressNode = true in scene
  colorNodeOnPress?: string;
  backAndroidToSkip?: boolean;
  // Default false
  debug?: boolean;
}

export type SceneDetailType = {
  id: string;
  nextDelay?: number;
  prevDelay?: number;
  pressToNext?: boolean;
  enablePressNode?: boolean;
  nextDisable?: boolean;
  prevDisable?: boolean;
}

export type SceneType = Array<SceneDetailType>;

export type ScenesType = Array<SceneType>;

export type AppTourContextType = {
  nodes: Animated.SharedValue<NodesType>;
  sceneIndex: number;
  setSceneIndex: React.Dispatch<React.SetStateAction<number>>;
  scenes: ScenesType,
  options?: OptionType;
}

interface AppTourView {
  nextStep: () => void;
  preStep: () => void;
  start: (step?: number) => void;
  stop: (cb?: () => void) => void;
  currentStep: (step?: number) => void;
}

export type AppTourType = AppTourView;

type EventName = 'onStart' | 'onStop' | 'onFinish' | 'onSkip' | 'onNext' | 'onPrevious' | 'onPressNode';

export type EventData = {
  name: EventName;
  step: number;
  node?: NodeType;
  scene?: SceneDetailType;
}

export type EventType = {
  name: string,
  callback: (data: EventData) => void,
}

// eslint-disable-next-line no-undef
export type EventsType = Record<
  | string,
  EventType
>;
