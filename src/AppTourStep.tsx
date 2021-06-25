/**
 * Created by nghinv on Tue Jun 22 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useRef } from 'react';
import type { View } from 'react-native';
import equals from 'react-fast-compare';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { setVector, setVectorLayout, useAppTour, useVector, useVectorLayout } from './hook';
import type { AppTourStepType } from './types';

function AppTourStep(props: AppTourStepType) {
  const { children, id, describe, title, maskType = 'rect', scrollTo } = props;
  const target = useVectorLayout();
  const targetPosition = useVector();
  const { addNode, debug } = useAppTour();
  const nodeRef = useRef<View>();

  useAnimatedReaction(() => {
    return scrollTo?.value;
  }, (scroll) => {
    if (scroll) {
      target.x.value = targetPosition.x.value + scroll.x;
      target.y.value = targetPosition.y.value - scroll.y;
      runOnJS(addNode)({
        id,
        title,
        describe,
        onPress: children.props.onPress,
        maskType,
        target,
      });
    }
  });

  const onLayout = () => {
    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      nodeRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
        const layout = {
          x: pageX,
          y: pageY,
          width,
          height,
        };
        setVectorLayout(target, layout);
        setVector(targetPosition, {
          x: layout.x,
          y: layout.y,
        });

        debug && console.log('ADD_NODE::', id, target, layout);
        addNode({
          id,
          title,
          describe,
          onPress: children.props.onPress,
          maskType,
          target,
        });
      });
    });
  };

  return (
    React.cloneElement(children, {
      ref: nodeRef,
      onLayout,
    })
  );
}

export default React.memo(AppTourStep, equals);
