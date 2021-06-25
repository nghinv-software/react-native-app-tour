/**
 * Created by nghinv on Wed Jun 23 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */
import React, { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { EventRegister } from 'react-native-event-listeners';
import { AppTourContext } from './AppTourContext';
import type { EventData, NodeType, TargetType, Vector } from './types';

export function useAppTour() {
  const { nodes, setSceneIndex, options } = React.useContext(AppTourContext);

  const addNode = useCallback((node: NodeType) => {
    const nodesValue = nodes.value;
    const findIndex = nodesValue.findIndex(n => n.id === node.id);
    if (findIndex !== -1) {
      nodesValue[findIndex] = node;
      nodes.value = nodesValue;
    } else {
      nodesValue.push(node);

      nodes.value = nodesValue;
    }
  }, [nodes]);

  return {
    addNode,
    nodes,
    setSceneIndex,
    debug: options?.debug,
  };
}

export function useEvent() {
  const addEventListener = useCallback((eventName: 'AppTourEvent', callback: (data: EventData) => void) => {
    return EventRegister.addEventListener(eventName, callback);
  }, []);

  const removeEventListener = useCallback((id: string | boolean) => {
    if (typeof id === 'string') {
      return EventRegister.removeEventListener(id);
    }

    return false;
  }, []);

  const removeAllListeners = useCallback(() => {
    EventRegister.removeAllListeners();
  }, []);

  const emitEvent = useCallback((eventName: 'AppTourEvent', data: EventData) => {
    EventRegister.emit(eventName, data);
  }, []);

  return {
    addEventListener,
    removeEventListener,
    removeAllListeners,
    emitEvent,
  };
}

export const useVectorLayout = (
  x = 0,
  y = 0,
  width = 0,
  height = 0,
) => {
  const targetX = useSharedValue(x);
  const targetY = useSharedValue(y);
  const targetWidth = useSharedValue(width);
  const targetHeight = useSharedValue(height);

  return {
    x: targetX,
    y: targetY,
    width: targetWidth,
    height: targetHeight,
  };
};

export const useVector = (
  x = 0,
  y = 0,
) => {
  const targetX = useSharedValue(x);
  const targetY = useSharedValue(y);

  return {
    x: targetX,
    y: targetY,
  };
};

export const setVectorLayout = (
  target: TargetType,
  {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
  },
) => {
  'worklet';

  target.x.value = x;
  target.y.value = y;
  target.width.value = width;
  target.height.value = height;
};

export const setVector = (
  target: Vector,
  {
    x = 0,
    y = 0,
  },
) => {
  'worklet';

  target.x.value = x;
  target.y.value = y;
};
