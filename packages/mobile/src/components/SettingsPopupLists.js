import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Keyboard, Platform, LayoutAnimation,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Circle } from 'react-native-animated-spinkit';

import dataApi from '../apis/data';
import {
  addListNames, updateListNames, moveListName, updateDeletingListName,
  retryDiedListNames, cancelDiedListNames, updatePopup,
} from '../actions';
import {
  MY_NOTES, TRASH, ARCHIVE, VALID_LIST_NAME, IN_USE_LIST_NAME,
  NO_LIST_NAME, TOO_LONG_LIST_NAME, DUPLICATE_LIST_NAME,
  CONFIRM_DELETE_POPUP, SWAP_LEFT, SWAP_RIGHT,
} from '../types/const';
import { getListNameMap } from '../selectors';
import { validateListNameDisplayName, isDiedStatus, isBusyStatus } from '../utils';
import { tailwind } from '../stylesheets/tailwind';
import { swapAnimConfig } from '../types/animConfigs';

const SettingsPopupLists = (props) => {

  const { onSidebarOpenBtnClick } = props;
  const { width: safeAreaWidth } = useSafeAreaFrame();
  const listNameMap = useSelector(getListNameMap);

  const validateDisplayName = (displayName) => {
    return validateListNameDisplayName(displayName, listNameMap);
  };

  useEffect(() => {
    if (Platform.OS === 'android') Keyboard.dismiss();
  }, []);

  return (
    <View style={tailwind('p-4 md:p-6 md:pt-4', safeAreaWidth)}>
      <View style={tailwind('border-b border-gray-200 md:hidden', safeAreaWidth)}>
        <TouchableOpacity onPress={onSidebarOpenBtnClick} style={tailwind('pb-1')}>
          <Text style={tailwind('text-sm text-gray-500 font-normal')}>{'<'} <Text style={tailwind('text-sm text-gray-500 font-normal')}>Settings</Text></Text>
        </TouchableOpacity>
        <Text style={tailwind('pb-2 text-xl text-gray-800 font-medium leading-6')}>Lists</Text>
      </View>
      <View style={tailwind('hidden md:flex', safeAreaWidth)}>
        <Text style={tailwind('text-base text-gray-800 font-medium leading-5')}>Lists</Text>
      </View>
      <View style={tailwind('pt-2.5')}>
        <ListNameEditor key="SPL_newListNameEditor" listNameObj={null} validateDisplayName={validateDisplayName} />
        {listNameMap.map(listNameObj => <ListNameEditor key={listNameObj.listName} listNameObj={listNameObj} validateDisplayName={validateDisplayName} />)}
      </View>
    </View>
  );
};

const MODE_VIEW = 'MODE_VIEW';
const MODE_EDIT = 'MODE_EDIT';

const LIST_NAME_MSGS = {
  [VALID_LIST_NAME]: '',
  [NO_LIST_NAME]: 'List is blank',
  [TOO_LONG_LIST_NAME]: 'List is too long',
  [DUPLICATE_LIST_NAME]: 'List already exists',
  [IN_USE_LIST_NAME]: 'List is in use',
};

const _ListNameEditor = (props) => {

  const { listNameObj, validateDisplayName } = props;

  const initialState = {
    mode: MODE_VIEW,
    value: '',
    msg: '',
    isCheckingCanDelete: false,
  };
  const [state, setState] = useState({ ...initialState });

  const input = useRef(null);
  const didOkBtnJustPress = useRef(false);
  const didCancelBtnJustPress = useRef(false);
  const didClick = useRef(false);
  const prevListNameObj = useRef(null);
  const dispatch = useDispatch();

  const onAddBtnClick = () => {
    setState(s => ({ ...s, mode: MODE_EDIT, value: '', msg: '' }));
    input.current.focus();
  };

  const onEditBtnClick = () => {
    setState(s => (
      { ...s, mode: MODE_EDIT, value: listNameObj.displayName, msg: '' }
    ));
    input.current.focus();
  };

  const onInputFocus = () => {
    setState(s => ({ ...s, mode: MODE_EDIT }));
  };

  const onInputChange = (e) => {
    // Event is reused and will be nullified after the event handler has been called.
    // https://reactjs.org/docs/legacy-event-pooling.html
    const text = e.nativeEvent.text;
    setState(s => ({ ...s, value: text, msg: '' }));
  };

  const onInputKeyPress = () => {
    onOkBtnClick();
  };

  const onInputBlur = () => {
    if (didOkBtnJustPress.current || didCancelBtnJustPress.current) {
      didOkBtnJustPress.current = false;
      didCancelBtnJustPress.current = false;
      return;
    }

    if (listNameObj) {
      if (listNameObj.displayName === state.value) {
        onCancelBtnClick();
        return;
      }
    } else {
      if (state.value === '') {
        onCancelBtnClick();
        return;
      }
    }
  };

  const onOkBtnPress = () => {
    didOkBtnJustPress.current = true;
  };

  const onOkBtnClick = () => {
    if (listNameObj) return onEditOkBtnClick();
    return onAddOkBtnClick();
  };

  const onAddOkBtnClick = () => {
    if (didClick.current) return;

    const listNameValidatedResult = validateDisplayName(state.value);
    if (listNameValidatedResult !== VALID_LIST_NAME) {
      setState(s => (
        { ...s, mode: MODE_EDIT, msg: LIST_NAME_MSGS[listNameValidatedResult] }
      ));
      input.current.focus();
      return;
    }

    dispatch(addListNames([state.value]));
    setState(s => ({ ...s, ...initialState }));
    input.current.blur();
    didClick.current = true;
  };

  const onEditOkBtnClick = () => {
    if (didClick.current) return;

    if (state.value === listNameObj.displayName) return onCancelBtnClick();

    const listNameValidatedResult = validateDisplayName(state.value);
    if (listNameValidatedResult !== VALID_LIST_NAME) {
      setState(s => (
        { ...s, mode: MODE_EDIT, msg: LIST_NAME_MSGS[listNameValidatedResult] }
      ));
      input.current.focus();
      return;
    }

    dispatch(updateListNames([listNameObj.listName], [state.value]));
    setState(s => ({ ...s, ...initialState, value: state.value }));
    input.current.blur();
    didClick.current = true;
  };

  const onCancelBtnPress = () => {
    didCancelBtnJustPress.current = true;
  };

  const onCancelBtnClick = () => {
    const value = listNameObj ? listNameObj.displayName : '';
    setState(s => ({ ...s, mode: MODE_VIEW, value, msg: '' }));
    input.current.blur();
  };

  const onDeleteBtnClick = () => {
    if (didClick.current) return;
    setState(s => ({ ...s, isCheckingCanDelete: true }));
    didClick.current = true;
  };

  const onMoveUpBtnClick = () => {
    if (didClick.current) return;
    if (Platform.OS === 'ios') {
      const animConfig = swapAnimConfig();
      LayoutAnimation.configureNext(animConfig);
    }
    dispatch(moveListName(listNameObj.listName, SWAP_LEFT));
    didClick.current = true;
  };

  const onMoveDownBtnClick = () => {
    if (didClick.current) return;
    if (Platform.OS === 'ios') {
      const animConfig = swapAnimConfig();
      LayoutAnimation.configureNext(animConfig);
    }
    dispatch(moveListName(listNameObj.listName, SWAP_RIGHT));
    didClick.current = true;
  };

  const onRetryRetryBtnClick = () => {
    if (didClick.current) return;
    dispatch(retryDiedListNames([listNameObj.listName]));
    didClick.current = true;
  };

  const onRetryCancelBtnClick = () => {
    dispatch(cancelDiedListNames([listNameObj.listName]));
  };

  useEffect(() => {
    if (listNameObj) setState(s => ({ ...s, value: listNameObj.displayName }));

    if (prevListNameObj.current && listNameObj) {
      if (
        (!isDiedStatus(prevListNameObj.current.status) &&
          isDiedStatus(listNameObj.status)) ||
        (!isBusyStatus(prevListNameObj.current.status) &&
          isBusyStatus(listNameObj.status))
      ) {
        didClick.current = false;
      }
    }
    prevListNameObj.current = listNameObj;
  }, [listNameObj]);

  useEffect(() => {
    if (state.mode === MODE_EDIT) didClick.current = false;
  }, [state.mode]);

  useEffect(() => {
    const deleteListName = async () => {
      if (state.isCheckingCanDelete) {
        const canDeletes = await dataApi.canDeleteListNames([listNameObj.listName]);
        const canDelete = canDeletes[0];
        if (!canDelete) {
          setState(s => ({
            ...s,
            msg: LIST_NAME_MSGS[IN_USE_LIST_NAME],
            isCheckingCanDelete: false,
          }));
          didClick.current = false;
          return;
        }

        dispatch(updateDeletingListName(listNameObj.listName));
        dispatch(updatePopup(CONFIRM_DELETE_POPUP, true));
        setState(s => ({ ...s, msg: '', isCheckingCanDelete: false }));
        didClick.current = false;
      }
    };
    deleteListName();
  }, [state.isCheckingCanDelete, listNameObj, dispatch]);

  const isBusy = (listNameObj && isBusyStatus(listNameObj.status)) || state.isCheckingCanDelete;
  const doRetry = listNameObj && isDiedStatus(listNameObj.status);

  let deleteBtn;
  if (isBusy) {
    deleteBtn = (
      <View style={tailwind('flex-grow-0 flex-shrink-0 flex-row justify-start items-center w-8 h-10')}>
        <Circle size={20} color="rgba(107, 114, 128, 1)" />
      </View>
    );
  } else if (doRetry) {
    deleteBtn = (
      <View style={tailwind('flex-grow-0 flex-shrink-0 flex-row justify-start items-center w-8 h-10')}>
        <Svg style={tailwind('text-red-500 font-normal')} width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9 12C9 12.5523 8.5523 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.5523 11 9 11.4477 9 12ZM8 3C7.44772 3 7 3.44772 7 4V8C7 8.5523 7.44772 9 8 9C8.5523 9 9 8.5523 9 8V4C9 3.44772 8.5523 3 8 3Z" />
        </Svg>
      </View>
    );
  } else {
    if (listNameObj && [MY_NOTES, TRASH, ARCHIVE].includes(listNameObj.listName)) {
      deleteBtn = (
        <View style={tailwind('flex-grow-0 flex-shrink-0 w-8 h-10')} />
      );
    } else {
      deleteBtn = (
        <TouchableOpacity onPress={onDeleteBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 flex-row justify-start items-center w-8 h-10')}>
          <Svg style={tailwind('text-gray-500 font-normal')} width={14} height={16} viewBox="0 0 14 16" fill="currentColor">
            <Path fillRule="evenodd" clipRule="evenodd" d="M6 0C5.62123 0 5.27497 0.214 5.10557 0.55279L4.38197 2H1C0.44772 2 0 2.44772 0 3C0 3.55228 0.44772 4 1 4V14C1 15.1046 1.89543 16 3 16H11C12.1046 16 13 15.1046 13 14V4C13.5523 4 14 3.55228 14 3C14 2.44772 13.5523 2 13 2H9.618L8.8944 0.55279C8.725 0.214 8.3788 0 8 0H6ZM4 6C4 5.44772 4.44772 5 5 5C5.55228 5 6 5.44772 6 6V12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12V6ZM9 5C8.4477 5 8 5.44772 8 6V12C8 12.5523 8.4477 13 9 13C9.5523 13 10 12.5523 10 12V6C10 5.44772 9.5523 5 9 5Z" />
          </Svg>
        </TouchableOpacity>
      );
    }
  }

  let errMsg;
  if (listNameObj && isDiedStatus(listNameObj.status)) {
    errMsg = 'Oops..., something went wrong!';
  } else {
    errMsg = state.msg;
  }

  return (
    <View style={tailwind('mt-1 flex-row justify-start items-center')}>
      {(state.mode === MODE_VIEW && listNameObj === null) && <TouchableOpacity onPress={onAddBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 flex-row justify-start items-center w-8 h-10')}>
        <Svg style={tailwind('text-gray-500 font-normal')} width={14} height={14} viewBox="0 0 14 14" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M7 0C7.5523 0 8 0.44772 8 1V6H13C13.5523 6 14 6.44772 14 7C14 7.5523 13.5523 8 13 8H8V13C8 13.5523 7.5523 14 7 14C6.44772 14 6 13.5523 6 13V8H1C0.44772 8 0 7.5523 0 7C0 6.44771 0.44772 6 1 6H6V1C6 0.44772 6.44772 0 7 0Z" />
        </Svg>
      </TouchableOpacity>}
      {(state.mode === MODE_VIEW && listNameObj !== null) && deleteBtn}
      {state.mode === MODE_EDIT && <TouchableOpacity onPressIn={onCancelBtnPress} onPress={onCancelBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 flex-row justify-start items-center w-8 h-10')}>
        <Svg style={tailwind('text-gray-500 font-normal')} width={12} height={12} viewBox="0 0 12 12" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M0.29289 0.29289C0.68342 -0.09763 1.31658 -0.09763 1.70711 0.29289L6 4.58579L10.2929 0.29289C10.6834 -0.09763 11.3166 -0.09763 11.7071 0.29289C12.0976 0.68342 12.0976 1.31658 11.7071 1.70711L7.4142 6L11.7071 10.2929C12.0976 10.6834 12.0976 11.3166 11.7071 11.7071C11.3166 12.0976 10.6834 12.0976 10.2929 11.7071L6 7.4142L1.70711 11.7071C1.31658 12.0976 0.68342 12.0976 0.29289 11.7071C-0.09763 11.3166 -0.09763 10.6834 0.29289 10.2929L4.58579 6L0.29289 1.70711C-0.09763 1.31658 -0.09763 0.68342 0.29289 0.29289Z" />
        </Svg>
      </TouchableOpacity>}
      <View style={tailwind('flex-grow flex-shrink')}>
        <TextInput ref={input} onFocus={onInputFocus} onBlur={onInputBlur} onChange={onInputChange} onSubmitEditing={onInputKeyPress} style={tailwind('px-0 py-1 w-full bg-white text-base leading-5 text-gray-600 font-normal border-0')} placeholder="Create new list" value={state.value} editable={!(isBusy || doRetry)} />
        <Text style={[tailwind('absolute left-0 right-0 text-sm text-red-600 font-medium leading-5'), { bottom: -12 }]} numberOfLines={1} ellipsizeMode="tail">{errMsg}</Text>
      </View>
      {state.mode === MODE_EDIT && <TouchableOpacity onPressIn={onOkBtnPress} onPress={onOkBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 justify-center items-center w-10 h-10')}>
        <Svg style={tailwind('text-gray-500 font-normal')} width={16} height={12} viewBox="0 0 14 10" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M13.7071 0.29289C14.0976 0.68342 14.0976 1.31658 13.7071 1.70711L5.70711 9.7071C5.31658 10.0976 4.68342 10.0976 4.29289 9.7071L0.29289 5.7071C-0.09763 5.3166 -0.09763 4.68342 0.29289 4.29289C0.68342 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.5858L12.2929 0.29289C12.6834 -0.09763 13.3166 -0.09763 13.7071 0.29289Z" />
        </Svg>
      </TouchableOpacity>}
      {(state.mode === MODE_VIEW && listNameObj !== null && !doRetry) && <TouchableOpacity onPress={onEditBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 justify-center items-center w-10 h-10')} disabled={isBusy}>
        <Svg style={tailwind('text-gray-500 font-normal')} width={16} height={16} viewBox="0 0 14 14" fill="currentColor">
          <Path d="M10.5859 0.585788C11.3669 -0.195262 12.6333 -0.195262 13.4143 0.585788C14.1954 1.36683 14.1954 2.63316 13.4143 3.41421L12.6214 4.20711L9.79297 1.37868L10.5859 0.585788Z" />
          <Path d="M8.3787 2.79289L0 11.1716V14H2.82842L11.2071 5.62132L8.3787 2.79289Z" />
        </Svg>
      </TouchableOpacity>}
      {(state.mode === MODE_VIEW && listNameObj !== null && !doRetry) && <TouchableOpacity onPress={onMoveUpBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 justify-center items-center w-10 h-10')} disabled={isBusy}>
        <Svg style={tailwind('text-gray-500 font-normal')} width={14} height={16} viewBox="0 0 14 16" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M0 15C0 14.4477 0.44772 14 1 14H13C13.5523 14 14 14.4477 14 15C14 15.5523 13.5523 16 13 16H1C0.44772 16 0 15.5523 0 15ZM3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289L6.29289 0.29289C6.48043 0.10536 6.73478 0 7 0C7.2652 0 7.5196 0.10536 7.7071 0.29289L10.7071 3.29289C11.0976 3.68342 11.0976 4.31658 10.7071 4.70711C10.3166 5.09763 9.6834 5.09763 9.2929 4.70711L8 3.41421V11C8 11.5523 7.5523 12 7 12C6.44771 12 6 11.5523 6 11V3.41421L4.70711 4.70711C4.31658 5.09763 3.68342 5.09763 3.29289 4.70711Z" />
        </Svg>
      </TouchableOpacity>}
      {(state.mode === MODE_VIEW && listNameObj !== null && !doRetry) && <TouchableOpacity onPress={onMoveDownBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 justify-center items-center w-10 h-10')} disabled={isBusy}>
        <Svg style={tailwind('text-gray-500 font-normal')} width={14} height={16} viewBox="0 0 14 16" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M0 15C0 14.4477 0.44772 14 1 14H13C13.5523 14 14 14.4477 14 15C14 15.5523 13.5523 16 13 16H1C0.44772 16 0 15.5523 0 15ZM3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L6 8.5858V1C6 0.44772 6.44771 0 7 0C7.5523 0 8 0.44771 8 1V8.5858L9.2929 7.29289C9.6834 6.90237 10.3166 6.90237 10.7071 7.29289C11.0976 7.68342 11.0976 8.3166 10.7071 8.7071L7.7071 11.7071C7.5196 11.8946 7.2652 12 7 12C6.73478 12 6.48043 11.8946 6.29289 11.7071L3.29289 8.7071C2.90237 8.3166 2.90237 7.68342 3.29289 7.29289Z" />
        </Svg>
      </TouchableOpacity>}
      {(state.mode === MODE_VIEW && listNameObj !== null && doRetry) && <TouchableOpacity onPress={onRetryRetryBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 justify-center items-center w-20 h-10')} disabled={isBusy}>
        <View style={[tailwind('justify-center items-center bg-white border border-gray-300 rounded-md shadow-sm'), { height: 28, paddingLeft: 10, paddingRight: 10 }]}>
          <Text style={tailwind('text-sm text-gray-500 font-normal')}>Retry</Text>
        </View>
      </TouchableOpacity>}
      {(state.mode === MODE_VIEW && listNameObj !== null && doRetry) && <TouchableOpacity onPress={onRetryCancelBtnClick} style={tailwind('flex-grow-0 flex-shrink-0 justify-center items-center h-10')} disabled={isBusy}>
        <Text style={tailwind('px-1.5 py-0.5 text-sm text-gray-500 font-normal')}>Cancel</Text>
      </TouchableOpacity>}
    </View>
  );
};

const ListNameEditor = React.memo(_ListNameEditor);

export default React.memo(SettingsPopupLists);
