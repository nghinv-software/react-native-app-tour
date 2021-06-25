/**
 * Created by nghinv on Thu Jun 24 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import equals from 'react-fast-compare';
import Animated, { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { AppTourContext } from './AppTourContext';
import ButtonText from './ButtonText';
import { useEvent } from './hook';

interface MenuButtonProps {
  currentStep: Animated.SharedValue<number>;
  onStop: () => void;
}

MenuButton.defaultProps = {

};

const OrderState = {
  start: 0,
  continue: 1,
  end: 2,
};

function MenuButton(props: MenuButtonProps) {
  const { currentStep, onStop } = props;
  const { nodes, scenes, sceneIndex, options } = useContext(AppTourContext);
  const { emitEvent } = useEvent();
  const [orderState, setOrderState] = useState(OrderState.start);
  const [enableNext, setEnableNext] = useState(true);
  const [enablePrev, setEnablePrev] = useState(true);

  useAnimatedReaction(() => {
    return currentStep.value;
  }, (value) => {
    const scene = scenes[sceneIndex];
    const sceneLength = scene.length;
    const sceneStep = scene[value];

    if (sceneStep.pressToNext) {
      enableNext && runOnJS(setEnableNext)(false);
    } else if (sceneStep.nextDisable && enableNext) {
      runOnJS(setEnableNext)(false);
    } else if (!sceneStep.nextDisable && !enableNext) {
      runOnJS(setEnableNext)(true);
    }

    if (sceneStep.prevDisable && enablePrev) {
      runOnJS(setEnablePrev)(false);
    }

    if (!sceneStep.prevDisable && !enablePrev) {
      runOnJS(setEnablePrev)(true);
    }

    if (value === sceneLength - 1) {
      if (orderState !== OrderState.end) {
        runOnJS(setOrderState)(OrderState.end);
      }
    } else if (value === 0) {
      if (orderState !== OrderState.start) {
        runOnJS(setOrderState)(OrderState.start);
      }
    } else if (value > 0 && value < sceneLength) {
      if (orderState !== OrderState.continue) {
        runOnJS(setOrderState)(OrderState.continue);
      }
    }
  });

  const onSkip = () => {
    onStop();

    const scene = scenes[sceneIndex][currentStep.value];
    emitEvent('AppTourEvent', {
      name: 'onSkip',
      step: currentStep.value,
      node: nodes.value.find(n => n.id === scene.id),
      scene,
    });
  };

  const onNextStep = () => {
    const nextValue = currentStep.value + 1;
    const sceneLength = scenes[sceneIndex].length;

    if (nextValue <= sceneLength - 1) {
      const scene = scenes[sceneIndex][nextValue];
      currentStep.value = nextValue;

      emitEvent('AppTourEvent', {
        name: 'onNext',
        step: nextValue,
        node: nodes.value.find(n => n.id === scene.id),
        scene,
      });
    } else {
      onStop();
    }
  };

  const onPrevious = () => {
    const preValue = currentStep.value - 1;

    if (preValue >= 0) {
      currentStep.value = preValue;

      const scene = scenes[sceneIndex][preValue];
      emitEvent('AppTourEvent', {
        name: 'onPrevious',
        step: preValue,
        node: nodes.value.find(n => n.id === scene.id),
        scene,
      });
    } else {
      onStop();
    }
  };

  const onFinish = () => {
    onStop();

    const scene = scenes[sceneIndex][currentStep.value];
    emitEvent('AppTourEvent', {
      name: 'onFinish',
      step: currentStep.value,
      node: nodes.value.find(n => n.id === scene.id),
      scene,
    });
  };

  return (
    <View style={styles.viewButton}>
      {
        orderState === OrderState.start && (
          <>
            <ButtonText
              title={options?.buttonTitle?.skip ?? 'Skip'}
              titleColor={options?.buttonTitleColor?.skip}
              onPress={onSkip}
            />
            {
              enableNext && (
                <ButtonText
                  title={options?.buttonTitle?.next ?? 'Next'}
                  titleColor={options?.buttonTitleColor?.next}
                  onPress={onNextStep}
                />
              )
            }
          </>
        )
      }
      {
        orderState === OrderState.continue && (
          <>
            <ButtonText
              title={options?.buttonTitle?.skip ?? 'Skip'}
              titleColor={options?.buttonTitleColor?.skip}
              onPress={onSkip}
            />
            {
              enablePrev && (
                <ButtonText
                  title={options?.buttonTitle?.prev ?? 'Previous'}
                  titleColor={options?.buttonTitleColor?.prev}
                  onPress={onPrevious}
                />
              )
            }
            {
              enableNext && (
                <ButtonText
                  title={options?.buttonTitle?.next ?? 'Next'}
                  titleColor={options?.buttonTitleColor?.next}
                  onPress={onNextStep}
                />
              )
            }
          </>
        )
      }
      {
        orderState === OrderState.end && (
          <>
            {
              enablePrev && (
                <ButtonText
                  title={options?.buttonTitle?.prev ?? 'Previous'}
                  titleColor={options?.buttonTitleColor?.prev}
                  onPress={onPrevious}
                />
              )
            }
            <ButtonText
              title={options?.buttonTitle?.finish ?? 'Finish'}
              titleColor={options?.buttonTitleColor?.finish}
              onPress={onFinish}
            />
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingLeft: 24,
    zIndex: 1,
  },
});

export default React.memo(MenuButton, equals);
