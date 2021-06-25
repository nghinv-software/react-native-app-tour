/**
 * Created by nghinv on Fri Jun 25 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import type { AppTourStep, ScenesType } from '../src/types';

const NODE_IDS = {
  homeTxtWelcome: '1',
  homeAvatar: '2',
  homeTextInput: '3',
  homeMenu: '4',
  photoMenu: '5',
  page2Title: '6',
  page2Avatar: '7',
  page2Button: '8',
  homeAvatarBottom: '9',
};

export const NODES: Array<AppTourStep> = [
  {
    id: NODE_IDS.homeTxtWelcome,
    title: 'Text welcome',
    describe: 'This is welcome title app',
  },
  {
    id: NODE_IDS.homeAvatar,
    maskType: 'circle',
    title: 'avatar',
    describe: 'Press here to change your avatar',
  },
  {
    id: NODE_IDS.homeTextInput,
    title: 'TextInput',
    describe: 'Input your name',
  },
  {
    id: NODE_IDS.homeMenu,
    maskType: 'circle',
    title: 'Home Menu',
    describe: 'Press in here to navigate to home screen',
  },
  {
    id: NODE_IDS.photoMenu,
    maskType: 'circle',
    title: 'Page 2 Menu',
    describe: 'Press in here to navigate to Page 2',
  },
  {
    id: NODE_IDS.page2Title,
    title: 'Text demo page 2',
    describe: 'This is title demo page 2',
  },
  {
    id: NODE_IDS.page2Avatar,
    maskType: 'circle',
    title: 'avatar',
    describe: 'Press here to change your avatar',
  },
  {
    id: NODE_IDS.page2Button,
    title: 'Button',
    describe: 'Button start app tour',
  },
  {
    id: NODE_IDS.homeAvatarBottom,
    title: 'Avatar bottom screen',
    describe: 'Avatar in bottom screen',
  },
];

export const SCENES: ScenesType = [
  [
    {
      id: NODE_IDS.homeTxtWelcome,
    },
    {
      id: NODE_IDS.homeAvatar,
    },
    {
      id: NODE_IDS.homeTextInput,
    },
    {
      id: NODE_IDS.homeAvatarBottom,
    },
    {
      id: NODE_IDS.photoMenu,
      nextDelay: 100,
      pressToNext: true,
      enablePressNode: true,
      prevDisable: true,
    },
    {
      id: NODE_IDS.page2Title,
    },
    {
      id: NODE_IDS.page2Avatar,
    },
    {
      id: NODE_IDS.page2Button,
    },
    {
      id: NODE_IDS.homeMenu,
    },
  ],
  [
    {
      id: NODES[0].id,
    },
    {
      id: NODES[1].id,
    },
    {
      id: NODES[2].id,
    },
    {
      id: NODES[4].id,
    },
  ],
  [
    {
      id: NODES[5].id,
    },
    {
      id: NODES[6].id,
    },
    {
      id: NODES[7].id,
    },
    {
      id: NODES[3].id,
    },
  ],
];

export const AppTourData = {
  scenes: SCENES,
  sceneIndex: 0,
};
