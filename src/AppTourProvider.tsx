/**
 * Created by nghinv on Wed Jun 23 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useRef, useState } from 'react';
import equals from 'react-fast-compare';
import { useSharedValue } from 'react-native-reanimated';
import AppTourView from './AppTourView';
import { AppTourContext } from './AppTourContext';
import type { AppTourType, OptionType, ScenesType } from './types';

interface AppTourProviderProps {
  children: React.ReactNode;
  options?: OptionType;
  scenes: ScenesType;
  sceneIndex?: number;
}

AppTourProvider.defaultProps = {

};

// eslint-disable-next-line import/no-mutable-exports
let AppTour: AppTourType;

function AppTourProvider(props: AppTourProviderProps) {
  const {
    children,
    options,
  } = props;
  const [sceneIndex, setSceneIndex] = useState<number>(props.sceneIndex ?? 0);
  const nodes = useSharedValue([]);
  const scenes = useRef(props.scenes ?? []).current;

  return (
    <AppTourContext.Provider
      value={{ nodes, options, scenes, sceneIndex, setSceneIndex }}
    >
      {children}
      <AppTourView ref={ref => { AppTour = ref; }} />
    </AppTourContext.Provider>
  );
}

export default React.memo(AppTourProvider, equals);

export {
  AppTour,
};
