import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { retryDiedNotes, cancelDiedNotes } from '../actions';
import { LG_WIDTH } from '../types/const';

import { useSafeAreaFrame } from '.';

const NoteEditorRetry = (props) => {

  const { onRightPanelCloseBtnClick } = props;
  const { width: safeAreaWidth } = useSafeAreaFrame();
  const note = useSelector(state => {
    const { listName, noteId } = state.display;
    return state.notes[listName][noteId];
  });
  const didClick = useRef(false);
  const dispatch = useDispatch();

  const onRetryCancelBtnClick = () => {
    if (didClick.current) return;
    dispatch(cancelDiedNotes([note.id]));
    didClick.current = true;
  };

  const onRetryRetryBtnClick = () => {
    if (didClick.current) return;
    dispatch(retryDiedNotes([note.id]));
    didClick.current = true;
  };

  useEffect(() => {
    didClick.current = false;
  }, [note.status]);

  const style = safeAreaWidth < LG_WIDTH ? {} : { minWidth: 400 };

  return (
    <div className="w-full h-full bg-white overflow-auto">
      <div style={style} className="relative px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="absolute top-0 left-0 lg:hidden">
          <button onClick={onRightPanelCloseBtnClick} type="button" className="px-4 py-4 text-sm rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-inset lg:hidden">
            <svg className="text-gray-500 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.70703 14.707C7.5195 14.8945 7.26519 14.9998 7.00003 14.9998C6.73487 14.9998 6.48056 14.8945 6.29303 14.707L2.29303 10.707C2.10556 10.5195 2.00024 10.2652 2.00024 10C2.00024 9.73488 2.10556 9.48057 2.29303 9.29304L6.29303 5.29304C6.48163 5.11088 6.73423 5.01009 6.99643 5.01237C7.25863 5.01465 7.50944 5.11981 7.69485 5.30522C7.88026 5.49063 7.98543 5.74144 7.9877 6.00364C7.98998 6.26584 7.88919 6.51844 7.70703 6.70704L5.41403 9.00004H17C17.2652 9.00004 17.5196 9.1054 17.7071 9.29293C17.8947 9.48047 18 9.73482 18 10C18 10.2653 17.8947 10.5196 17.7071 10.7071C17.5196 10.8947 17.2652 11 17 11H5.41403L7.70703 13.293C7.8945 13.4806 7.99982 13.7349 7.99982 14C7.99982 14.2652 7.8945 14.5195 7.70703 14.707Z" />
            </svg>
          </button>
        </div>
        <div className="w-full h-16"></div>
        <h3 className="pt-5 text-gray-800 text-lg font-medium">Problem found</h3>
        <p className="text-gray-500 text-sm font-normal">
          Please wait a moment and try again. If the problem persists, please&nbsp;
          <a className="underline rounded hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600" href="/#support">
            contact us
            <svg className="mb-2 inline-block w-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3C10.4477 3 10 3.44772 10 4C10 4.55228 10.4477 5 11 5H13.5858L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L15 6.41421V9C15 9.55228 15.4477 10 16 10C16.5523 10 17 9.55228 17 9V4C17 3.44772 16.5523 3 16 3H11Z" />
              <path d="M5 5C3.89543 5 3 5.89543 3 7V15C3 16.1046 3.89543 17 5 17H13C14.1046 17 15 16.1046 15 15V12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12V15H5V7H8C8.55228 7 9 6.55228 9 6C9 5.44772 8.55228 5 8 5H5Z" />
            </svg>
          </a>.
        </p>
        <div className="pt-6 flex items-center">
          <button onClick={onRetryRetryBtnClick} type="button" className="flex items-center px-4 py-2 border border-gray-300 shadow-sm rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600">
            <svg className="w-5 h-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4 2C4.26522 2 4.51957 2.10536 4.70711 2.29289C4.89464 2.48043 5 2.73478 5 3V5.101C5.83204 4.25227 6.86643 3.62931 8.00574 3.29078C9.14506 2.95226 10.3518 2.90932 11.5123 3.16601C12.6728 3.42269 13.7488 3.97056 14.6391 4.758C15.5294 5.54544 16.2045 6.54654 16.601 7.667C16.6491 7.79176 16.6717 7.92489 16.6674 8.05854C16.6632 8.19218 16.6322 8.32361 16.5763 8.44506C16.5203 8.56651 16.4406 8.67551 16.3418 8.76561C16.243 8.85571 16.1272 8.92508 16.0011 8.96963C15.875 9.01417 15.7413 9.03298 15.6078 9.02494C15.4744 9.0169 15.3439 8.98217 15.224 8.92282C15.1042 8.86346 14.9975 8.78068 14.9103 8.67937C14.823 8.57806 14.7569 8.46029 14.716 8.333C14.4141 7.47982 13.8865 6.72451 13.1892 6.14758C12.4919 5.57064 11.6512 5.19369 10.7566 5.05688C9.86195 4.92008 8.94698 5.02855 8.10916 5.37074C7.27133 5.71293 6.54204 6.27602 5.999 7H9C9.26522 7 9.51957 7.10536 9.70711 7.29289C9.89464 7.48043 10 7.73478 10 8C10 8.26522 9.89464 8.51957 9.70711 8.70711C9.51957 8.89464 9.26522 9 9 9H4C3.73478 9 3.48043 8.89464 3.29289 8.70711C3.10536 8.51957 3 8.26522 3 8V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2ZM4.008 11.057C4.13184 11.0133 4.26308 10.9943 4.39422 11.0013C4.52537 11.0083 4.65386 11.0411 4.77235 11.0977C4.89084 11.1544 4.99701 11.2338 5.0848 11.3315C5.17259 11.4291 5.24028 11.5432 5.284 11.667C5.58586 12.5202 6.11355 13.2755 6.81082 13.8524C7.50809 14.4294 8.34883 14.8063 9.24344 14.9431C10.138 15.0799 11.053 14.9714 11.8908 14.6293C12.7287 14.2871 13.458 13.724 14.001 13H11C10.7348 13 10.4804 12.8946 10.2929 12.7071C10.1054 12.5196 10 12.2652 10 12C10 11.7348 10.1054 11.4804 10.2929 11.2929C10.4804 11.1054 10.7348 11 11 11H16C16.2652 11 16.5196 11.1054 16.7071 11.2929C16.8946 11.4804 17 11.7348 17 12V17C17 17.2652 16.8946 17.5196 16.7071 17.7071C16.5196 17.8946 16.2652 18 16 18C15.7348 18 15.4804 17.8946 15.2929 17.7071C15.1054 17.5196 15 17.2652 15 17V14.899C14.168 15.7477 13.1336 16.3707 11.9943 16.7092C10.8549 17.0477 9.64821 17.0907 8.48772 16.834C7.32723 16.5773 6.25117 16.0294 5.36091 15.242C4.47065 14.4546 3.79548 13.4535 3.399 12.333C3.35526 12.2092 3.33634 12.0779 3.34333 11.9468C3.35031 11.8156 3.38306 11.6871 3.43971 11.5687C3.49635 11.4502 3.57578 11.344 3.67346 11.2562C3.77114 11.1684 3.88516 11.1007 4.009 11.057H4.008Z" />
            </svg>
            Retry
          </button>
          <button onClick={onRetryCancelBtnClick} className="ml-2 mt-1 px-3 py-1 text-sm text-gray-600 rounded-md border border-white bg-white hover:underline focus:outline-none focus:ring-2 focus:ring-green-600">Cancel</button>
        </div>
        <div className="mt-6 border border-gray-200 rounded-lg px-4 py-5">
          <h3 className="text-lg font-medium text-gray-800">{note.title}</h3>
          <p className="mt-3 text-base font-normal text-gray-600">{note.body}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoteEditorRetry);
