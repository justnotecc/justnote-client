import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { UPDATING, DIED_UPDATING, ADDED_DT, UPDATED_DT, } from '../types/const';
import { updateSettings, updateUpdateSettingsProgress } from '../actions';

const SettingsPopupMisc = (props) => {

  const { onSidebarOpenBtnClick } = props;
  const doDeleteOldLinksInTrash = useSelector(state => state.settings.doDeleteOldLinksInTrash);
  const sortOn = useSelector(state => state.settings.sortOn);
  const doDescendingOrder = useSelector(state => state.settings.doDescendingOrder);
  const updateSettingsProgress = useSelector(state => state.settings.updateSettingsProgress);
  const dispatch = useDispatch();

  const onDoDeleteBtnClick = () => {
    dispatch(updateSettings({ doDeleteOldLinksInTrash: !doDeleteOldLinksInTrash }));
  };

  const onSortOnInputChange = (e) => {
    const sortOn = e.target.value;
    dispatch(updateSettings({ sortOn }));
  };

  const onDoDescendingInputChange = (e) => {

    let doDescendingOrder;

    const value = e.target.value;
    if (value === 'ascending') doDescendingOrder = false;
    else if (value === 'descending') doDescendingOrder = true;
    else throw new Error(`Invalid value: ${value}`);

    dispatch(updateSettings({ doDescendingOrder }));
  };

  const onDiedUpdatingCloseBtnClick = () => {
    dispatch(updateUpdateSettingsProgress(null));
  };

  const renderUpdateSettingsProgress = () => {

    if (!updateSettingsProgress) return null;
    if (updateSettingsProgress.status === UPDATING) return null;
    if (updateSettingsProgress.status === DIED_UPDATING) {
      return (
        <div className="absolute top-0 inset-x-0 flex justify-center items-start">
          <div className="m-4 p-4 bg-red-50 rounded-md shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-base text-red-800 font-medium text-left leading-5">Updating Error!</h3>
                <p className="mt-2.5 text-base text-red-700">
                  Please wait a moment and try again. <br className="hidden sm:inline" />If the problem persists, please&nbsp;
                  <a className="underline hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-green-600" href="/#support">
                    contact us
                    <svg className="mb-2 inline-block w-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 3C10.4477 3 10 3.44772 10 4C10 4.55228 10.4477 5 11 5H13.5858L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L15 6.41421V9C15 9.55228 15.4477 10 16 10C16.5523 10 17 9.55228 17 9V4C17 3.44772 16.5523 3 16 3H11Z" />
                      <path d="M5 5C3.89543 5 3 5.89543 3 7V15C3 16.1046 3.89543 17 5 17H13C14.1046 17 15 16.1046 15 15V12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12V15H5V7H8C8.55228 7 9 6.55228 9 6C9 5.44772 8.55228 5 8 5H5Z" />
                    </svg>
                  </a>.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button onClick={onDiedUpdatingCloseBtnClick} className="p-1.5 inline-flex text-red-400 rounded-md hover:bg-red-100 focus:outline-none focus:bg-red-100 transition ease-in-out duration-150" aria-label="Dismiss">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    throw new Error(`Invalid updateSettingsProgress: ${updateSettingsProgress}`);
  };

  const doDeleteBtnClassNames = doDeleteOldLinksInTrash ? 'bg-green-600' : 'bg-gray-200';
  const doDeleteBtnInnerClassNames = doDeleteOldLinksInTrash ? 'translate-x-5' : 'translate-x-0';

  const addedDTBtnClassNames = sortOn === ADDED_DT ? 'bg-green-100 border-green-200 z-10' : 'border-gray-200';
  const addedDTBtnInnerClassNames = sortOn === ADDED_DT ? 'text-green-800' : 'text-gray-700';

  const updatedDTBtnClassNames = sortOn === UPDATED_DT ? 'bg-green-100 border-green-200 z-10' : 'border-gray-200';
  const updatedDTBtnInnerClassNames = sortOn === UPDATED_DT ? 'text-green-800' : 'text-gray-700';

  const ascendingBtnClassNames = !doDescendingOrder ? 'bg-green-100 border-green-200 z-10' : 'border-gray-200';
  const ascendingBtnInnerClassNames = !doDescendingOrder ? 'text-green-800' : 'text-gray-700';

  const descendingBtnClassNames = doDescendingOrder ? 'bg-green-100 border-green-200 z-10' : 'border-gray-200';
  const descendingBtnInnerClassNames = doDescendingOrder ? 'text-green-800' : 'text-gray-700';

  return (
    <div className="p-4 relative md:p-6 md:pt-4">
      <div className="border-b border-gray-200 md:hidden">
        <button onClick={onSidebarOpenBtnClick} className="mb-1 group focus:outline-none focus:ring-2 focus:ring-green-600 rounded" >
          <span className="text-sm text-gray-500">{'<'} <span className="group-hover:underline">Settings</span></span>
        </button>
        <h3 className="pb-2 text-xl text-gray-800 font-medium leading-none">Misc.</h3>
      </div>
      <div className="mt-6 flex items-center justify-between space-x-4 md:mt-0">
        <div className="flex flex-col">
          <h4 id="auto-delete-option-label" className="text-base text-gray-800 font-medium leading-none">Auto Cleanup</h4>
          <p id="auto-delete-option-description" className="mt-2.5 text-base text-gray-500 leading-relaxed">Allow old removed notes in Trash to be automatically deleted after 45 days</p>
        </div>
        <span onClick={onDoDeleteBtnClick} role="checkbox" tabIndex={0} aria-checked="true" aria-labelledby="auto-cleanup-option-label" aria-describedby="auto-cleanup-option-description" className={`${doDeleteBtnClassNames} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600`}>
          <span aria-hidden="true" className={`${doDeleteBtnInnerClassNames} inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}></span>
        </span>
      </div>
      <div className="mt-8 mb-4 flex flex-col">
        <h4 id="auto-delete-option-label" className="text-base text-gray-800 font-medium leading-none">List Order On</h4>
        <div className="sm:flex sm:items-start sm:justify-between sm:space-x-4">
          <p id="auto-delete-option-description" className="mt-2.5 flex-grow flex-shrink text-base text-gray-500 leading-relaxed">Choose whether your notes are sorted on <span className="font-semibold">added date</span> or <span className="font-semibold">updated date</span> when you browse your notes.</p>
          <div className="mx-auto mt-2.5 w-full max-w-48 bg-white rounded-md shadow-sm -space-y-px sm:mt-1 sm:flex-grow-0 sm:flex-shrink-0 sm:w-48 sm:max-w-none">
            <div className={`${addedDTBtnClassNames} p-4 relative flex border rounded-tl-md rounded-tr-md`}>
              <div className="flex items-center h-5">
                <input onChange={onSortOnInputChange} id="list-order-on-option-1" name="list-order-on" type="radio" className="h-4 w-4 text-green-600 transition duration-150 ease-in-out cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-green-600" checked={sortOn === ADDED_DT} value={ADDED_DT} />
              </div>
              <label htmlFor="list-order-on-option-1" className="ml-3 flex flex-col cursor-pointer">
                <span className={`${addedDTBtnInnerClassNames} block text-sm leading-5 font-medium`}>Added Date</span>
              </label>
            </div>
            <div className={`${updatedDTBtnClassNames} p-4 flex relative border rounded-bl-md rounded-br-md`}>
              <div className="flex items-center h-5">
                <input onChange={onSortOnInputChange} id="list-order-on-option-2" name="list-order-on" type="radio" className="h-4 w-4 text-green-600 transition duration-150 ease-in-out cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-green-600" checked={sortOn === UPDATED_DT} value={UPDATED_DT} />
              </div>
              <label htmlFor="list-order-on-option-2" className="ml-3 flex flex-col cursor-pointer">
                <span className={`${updatedDTBtnInnerClassNames} block text-sm leading-5 font-medium`}>Updated Date</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 mb-4 flex flex-col">
        <h4 id="auto-delete-option-label" className="text-base text-gray-800 font-medium leading-none">List Order Direction</h4>
        <div className="sm:flex sm:items-start sm:justify-between sm:space-x-4">
          <p id="auto-delete-option-description" className="mt-2.5 flex-grow flex-shrink text-base text-gray-500 leading-relaxed">Choose whether your notes are sorted in <span className="font-semibold">ascending order</span> (i.e. notes you create first appear first) or <span className="font-semibold">descending order</span> (i.e. notes you create last appear first) when you browse your notes.</p>
          <div className="mx-auto mt-2.5 w-full max-w-48 bg-white rounded-md shadow-sm -space-y-px sm:mt-1 sm:flex-grow-0 sm:flex-shrink-0 sm:w-48 sm:max-w-none">
            <div className={`${ascendingBtnClassNames} p-4 relative flex border rounded-tl-md rounded-tr-md`}>
              <div className="flex items-center h-5">
                <input onChange={onDoDescendingInputChange} id="list-order-direction-option-1" name="list-order-direction" type="radio" className="h-4 w-4 text-green-600 transition duration-150 ease-in-out cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-green-600" checked={!doDescendingOrder} value="ascending" />
              </div>
              <label htmlFor="list-order-direction-option-1" className="ml-3 flex flex-col cursor-pointer">
                <span className={`${ascendingBtnInnerClassNames} block text-sm leading-5 font-medium`}>Ascending order</span>
              </label>
            </div>
            <div className={`${descendingBtnClassNames} p-4 flex relative border rounded-bl-md rounded-br-md`}>
              <div className="flex items-center h-5">
                <input onChange={onDoDescendingInputChange} id="list-order-direction-option-2" name="list-order-direction" type="radio" className="h-4 w-4 text-green-600 transition duration-150 ease-in-out cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-green-600" checked={doDescendingOrder} value="descending" />
              </div>
              <label htmlFor="list-order-direction-option-2" className="ml-3 flex flex-col cursor-pointer">
                <span className={`${descendingBtnInnerClassNames} block text-sm leading-5 font-medium`}>Descending order</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      {renderUpdateSettingsProgress()}
    </div>
  );
};

export default React.memo(SettingsPopupMisc);
