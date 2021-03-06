import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { changeListName, updatePopup } from '../actions';
import { SIDEBAR_POPUP, TRASH, ARCHIVE, LG_WIDTH } from '../types/const';
import { getListNameMap } from '../selectors';
import { tailwind } from '../stylesheets/tailwind';

const SidebarListNames = () => {

  const { width: safeAreaWidth } = useSafeAreaFrame();
  const listName = useSelector(state => state.display.listName);
  const listNameMap = useSelector(getListNameMap);
  const dispatch = useDispatch();

  const onListNameBtnClick = (selectedListName) => {
    dispatch(changeListName(selectedListName, true));
    if (safeAreaWidth < LG_WIDTH) dispatch(updatePopup(SIDEBAR_POPUP, false, null));
  };

  const buttons = listNameMap.map((listNameObj, i) => {

    let btnClassNames, svgClassNames, textClassNames;
    if (listNameObj.listName === listName) {
      btnClassNames = 'bg-gray-200';
      svgClassNames = 'text-gray-500';
      textClassNames = 'text-gray-900';
    } else {
      btnClassNames = '';
      svgClassNames = 'text-gray-400';
      textClassNames = 'text-gray-700';
    }
    svgClassNames += ' flex-grow-0 flex-shrink-0 mr-3 font-normal';

    if (i !== 0) btnClassNames += ' mt-1';

    let svg;
    if (listNameObj.listName === TRASH) {
      svg = (
        <Svg width={20} height={20} style={tailwind(svgClassNames)} viewBox="0 0 20 20" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M9 2C8.81434 2.0001 8.63237 2.05188 8.47447 2.14955C8.31658 2.24722 8.18899 2.38692 8.106 2.553L7.382 4H4C3.73478 4 3.48043 4.10536 3.29289 4.29289C3.10536 4.48043 3 4.73478 3 5C3 5.26522 3.10536 5.51957 3.29289 5.70711C3.48043 5.89464 3.73478 6 4 6V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H14C14.5304 18 15.0391 17.7893 15.4142 17.4142C15.7893 17.0391 16 16.5304 16 16V6C16.2652 6 16.5196 5.89464 16.7071 5.70711C16.8946 5.51957 17 5.26522 17 5C17 4.73478 16.8946 4.48043 16.7071 4.29289C16.5196 4.10536 16.2652 4 16 4H12.618L11.894 2.553C11.811 2.38692 11.6834 2.24722 11.5255 2.14955C11.3676 2.05188 11.1857 2.0001 11 2H9ZM7 8C7 7.73478 7.10536 7.48043 7.29289 7.29289C7.48043 7.10536 7.73478 7 8 7C8.26522 7 8.51957 7.10536 8.70711 7.29289C8.89464 7.48043 9 7.73478 9 8V14C9 14.2652 8.89464 14.5196 8.70711 14.7071C8.51957 14.8946 8.26522 15 8 15C7.73478 15 7.48043 14.8946 7.29289 14.7071C7.10536 14.5196 7 14.2652 7 14V8ZM12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V14C11 14.2652 11.1054 14.5196 11.2929 14.7071C11.4804 14.8946 11.7348 15 12 15C12.2652 15 12.5196 14.8946 12.7071 14.7071C12.8946 14.5196 13 14.2652 13 14V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7Z" />
        </Svg>
      );
    } else if (listNameObj.listName === ARCHIVE) {
      svg = (
        <Svg width={20} height={20} style={tailwind(svgClassNames)} viewBox="0 0 20 20" fill="currentColor">
          <Path d="M4 3C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5C2 5.53043 2.21071 6.03914 2.58579 6.41421C2.96086 6.78929 3.46957 7 4 7H16C16.5304 7 17.0391 6.78929 17.4142 6.41421C17.7893 6.03914 18 5.53043 18 5C18 4.46957 17.7893 3.96086 17.4142 3.58579C17.0391 3.21071 16.5304 3 16 3H4Z" />
          <Path fillRule="evenodd" clipRule="evenodd" d="M3 8H17V15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17H5C4.46957 17 3.96086 16.7893 3.58579 16.4142C3.21071 16.0391 3 15.5304 3 15V8ZM8 11C8 10.7348 8.10536 10.4804 8.29289 10.2929C8.48043 10.1054 8.73478 10 9 10H11C11.2652 10 11.5196 10.1054 11.7071 10.2929C11.8946 10.4804 12 10.7348 12 11C12 11.2652 11.8946 11.5196 11.7071 11.7071C11.5196 11.8946 11.2652 12 11 12H9C8.73478 12 8.48043 11.8946 8.29289 11.7071C8.10536 11.5196 8 11.2652 8 11Z" />
        </Svg>
      );
    } else if (listNameObj.listName === listName) {
      svg = (
        <Svg width={20} height={20} style={tailwind(svgClassNames)} viewBox="0 0 20 20" fill="currentColor">
          <Path fillRule="evenodd" clipRule="evenodd" d="M2 6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H8L10 6H14C14.5304 6 15.0391 6.21071 15.4142 6.58579C15.7893 6.96086 16 7.46957 16 8V9H8C7.20435 9 6.44129 9.31607 5.87868 9.87868C5.31607 10.4413 5 11.2044 5 12V13.5C5 13.8978 4.84196 14.2794 4.56066 14.5607C4.27936 14.842 3.89782 15 3.5 15C3.10218 15 2.72064 14.842 2.43934 14.5607C2.15804 14.2794 2 13.8978 2 13.5V6Z" />
          <Path d="M6 12C6 11.4696 6.21071 10.9609 6.58579 10.5858C6.96086 10.2107 7.46957 10 8 10H16C16.5304 10 17.0391 10.2107 17.4142 10.5858C17.7893 10.9609 18 11.4696 18 12V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16H2H4C4.53043 16 5.03914 15.7893 5.41421 15.4142C5.78929 15.0391 6 14.5304 6 14V12Z" />
        </Svg>
      );
    } else {
      svg = (
        <Svg width={20} height={20} style={tailwind(svgClassNames)} viewBox="0 0 20 20" fill="currentColor">
          <Path d="M2 6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H9L11 6H16C16.5304 6 17.0391 6.21071 17.4142 6.58579C17.7893 6.96086 18 7.46957 18 8V14C18 14.5304 17.7893 15.0391 17.4142 15.4142C17.0391 15.7893 16.5304 16 16 16H4C3.46957 16 2.96086 15.7893 2.58579 15.4142C2.21071 15.0391 2 14.5304 2 14V6Z" />
        </Svg>
      );
    }

    return (
      <TouchableOpacity key={listNameObj.listName} onPress={() => onListNameBtnClick(listNameObj.listName)} style={tailwind(`${btnClassNames} flex-row items-center px-2 py-2 rounded-md w-full`)}>
        {svg}
        <Text style={tailwind(`${textClassNames} text-base font-medium flex-shrink flex-grow lg:text-sm`, safeAreaWidth)} numberOfLines={1} ellipsizeMode="tail">{listNameObj.displayName}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={tailwind('flex-1 mt-6')}>
      <ScrollView>
        <View style={tailwind('pl-3 pr-1')}>
          {buttons}
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(SidebarListNames);
