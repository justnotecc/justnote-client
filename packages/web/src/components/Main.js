import React from 'react';

import { LG_WIDTH } from '../types/const';

import { useSafeAreaFrame } from '.';
import ColsPanel from './ColsPanel';
import NavPanel from './NavPanel';
import SidebarProfilePopup from './SidebarProfilePopup';
import NoteListMenuPopup from './NoteListMenuPopup';
import MoveToPopup from './MoveToPopup';
import SettingsPopup from './SettingsPopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ConfirmDiscardPopup from './ConfirmDiscardPopup';
import AlertScreenRotationPopup from './AlertScreenRotationPopup';

const Main = () => {

  const { width: safeAreaWidth } = useSafeAreaFrame();
  const panel = safeAreaWidth < LG_WIDTH ? <NavPanel /> : <ColsPanel />;

  return (
    <React.Fragment>
      {panel}
      <SidebarProfilePopup />
      <NoteListMenuPopup />
      <MoveToPopup />
      <SettingsPopup />
      <ConfirmDeletePopup />
      <ConfirmDiscardPopup />
      <AlertScreenRotationPopup />
    </React.Fragment>
  );
};

export default React.memo(Main);
