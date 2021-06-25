/**
 * Created by nghinv on Wed Jun 23 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React from 'react';
import type { AppTourContextType } from './types';

// @ts-ignore
export const AppTourContext = React.createContext<AppTourContextType>({
  // nodes: [],
  sceneIndex: 0,
  scenes: [],
  setSceneIndex: () => { },
});
