import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, BackHandler,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { updatePopup, deleteNotes, deleteListNames } from '../actions';
import { CONFIRM_DELETE_POPUP } from '../types/const';
import { tailwind } from '../stylesheets/tailwind';
import { popupFMV } from '../types/animConfigs';

const ConfirmDeletePopup = () => {

  const insets = useSafeAreaInsets();
  const isShown = useSelector(state => state.display.isConfirmDeletePopupShown);
  const deletingListName = useSelector(state => state.display.deletingListName);
  const [didCloseAnimEnd, setDidCloseAnimEnd] = useState(!isShown);
  const [derivedIsShown, setDerivedIsShown] = useState(isShown);
  const popupAnim = useRef(new Animated.Value(0)).current;
  const popupBackHandler = useRef(null);
  const didClick = useRef(false);
  const dispatch = useDispatch();

  const onConfirmDeleteCancelBtnClick = useCallback(() => {
    if (didClick.current) return;
    dispatch(updatePopup(CONFIRM_DELETE_POPUP, false, null));
    didClick.current = true;
  }, [dispatch]);

  const onConfirmDeleteOkBtnClick = () => {
    if (didClick.current) return;

    if (deletingListName) dispatch(deleteListNames([deletingListName]));
    else dispatch(deleteNotes());
    onConfirmDeleteCancelBtnClick();

    didClick.current = true;
  };

  const registerPopupBackHandler = useCallback((doRegister) => {
    if (doRegister) {
      if (!popupBackHandler.current) {
        popupBackHandler.current = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            onConfirmDeleteCancelBtnClick();
            return true;
          }
        );
      }
    } else {
      if (popupBackHandler.current) {
        popupBackHandler.current.remove();
        popupBackHandler.current = null;
      }
    }
  }, [onConfirmDeleteCancelBtnClick]);

  useEffect(() => {
    if (isShown) {
      Animated.timing(popupAnim, { toValue: 1, ...popupFMV.visible }).start();
      didClick.current = false;
    } else {
      Animated.timing(popupAnim, { toValue: 0, ...popupFMV.hidden }).start(() => {
        setDidCloseAnimEnd(true);
      });
    }

    registerPopupBackHandler(isShown);
    return () => {
      registerPopupBackHandler(false);
    };
  }, [isShown, popupAnim, registerPopupBackHandler]);

  if (derivedIsShown !== isShown) {
    if (derivedIsShown && !isShown) setDidCloseAnimEnd(false);
    setDerivedIsShown(isShown);
  }

  if (!isShown && didCloseAnimEnd) return null;

  const canvasStyle = { paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right };
  const popupStyle = {
    opacity: popupAnim,
    transform: [
      { scale: popupAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
    ],
  };

  return (
    <View style={[tailwind('absolute inset-0 items-center justify-center'), canvasStyle]}>
      <TouchableWithoutFeedback onPress={onConfirmDeleteCancelBtnClick}>
        <View style={tailwind('absolute inset-0 opacity-25 bg-black')} />
      </TouchableWithoutFeedback>
      <Animated.View style={[tailwind('w-full max-w-48 -mt-8 pt-4 pb-2 rounded-md shadow-lg bg-white'), popupStyle]}>
        <Text style={tailwind('text-base font-normal text-gray-600 text-center')}>Confirm delete?</Text>
        <View style={tailwind('pt-1 flex-row justify-center')}>
          <TouchableOpacity onPress={onConfirmDeleteOkBtnClick} style={tailwind('bg-white m-2 px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm')}>
            <Text style={tailwind('text-sm font-normal text-gray-600')}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirmDeleteCancelBtnClick} style={tailwind('bg-white m-2 px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm')}>
            <Text style={tailwind('text-sm font-normal text-gray-600')}>No</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default React.memo(ConfirmDeletePopup);
