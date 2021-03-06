import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { updatePopupUrlHash } from '../actions';
import { SIDEBAR_POPUP, NEW_NOTE, NEW_NOTE_OBJ } from '../types/const';
import {
  canvasFMV, sideBarOverlayFMV, sideBarFMV, rightPanelFMV,
} from '../types/animConfigs';

import { useSafeAreaFrame } from '.';
import Sidebar from './Sidebar';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';

const NavPanel = () => {

  const { height: safeAreaHeight } = useSafeAreaFrame();
  const isSidebarPopupShown = useSelector(state => state.display.isSidebarPopupShown);
  const note = useSelector(state => {
    const { listName, noteId } = state.display;

    if (!noteId) return null;
    if (noteId === NEW_NOTE) return NEW_NOTE_OBJ;
    if (noteId.startsWith('conflict')) return state.conflictedNotes[listName][noteId];
    return state.notes[listName][noteId];
  });
  const [derivedNote, setDerivedNote] = useState(note);

  const onSidebarOpenBtnClick = () => {
    updatePopupUrlHash(SIDEBAR_POPUP, true, null);
  };

  const onSidebarCloseBtnClick = () => {
    updatePopupUrlHash(SIDEBAR_POPUP, false, null);
  };

  const onRightPanelAnimEnd = () => {
    if (!note && note !== derivedNote) setDerivedNote(note);
  };

  if (note && note !== derivedNote) {
    setDerivedNote(note);
  }

  return (
    <div style={{ height: safeAreaHeight }} className="relative w-full bg-white">
      {/* Main panel */}
      <NoteList onSidebarOpenBtnClick={onSidebarOpenBtnClick} />
      {/* Sidebar */}
      <motion.div className="absolute inset-0 flex overflow-hidden" variants={canvasFMV} initial={false} animate={isSidebarPopupShown ? 'visible' : 'hidden'}>
        <motion.button onClick={onSidebarCloseBtnClick} className="absolute inset-0 w-full h-full" variants={sideBarOverlayFMV}>
          <div className="absolute inset-0 bg-white" />
        </motion.button>
        <div className="absolute top-0 right-0 p-1">
          <button onClick={onSidebarCloseBtnClick} className="flex items-center justify-center h-7 w-7 group focus:outline-none" aria-label="Close sidebar popup">
            <svg className="h-5 w-5 text-gray-400 rounded group-hover:text-gray-500 group-focus:ring-2 group-focus:ring-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <motion.div className="flex-1 max-w-64 bg-gray-100 pr-2" variants={sideBarFMV}>
          <Sidebar />
        </motion.div>
        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </motion.div>
      {/* Right panel */}
      <motion.div className="absolute inset-0 overflow-hidden" variants={canvasFMV} initial={false} animate={note ? 'visible' : 'hidden'} onAnimationComplete={onRightPanelAnimEnd}>
        <motion.div className="w-full h-full" variants={rightPanelFMV}>
          <NoteEditor note={derivedNote} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(NavPanel);
