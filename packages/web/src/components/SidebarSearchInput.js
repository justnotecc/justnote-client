import React, { } from 'react';

const SidebarSearchInput = () => {

  return (
    <div className="pl-3 pr-1 mt-5">
      <label htmlFor="search" className="sr-only">Search</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
          <svg className="mr-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input type="text" name="search" id="search" className="focus:ring-green-600 focus:border-green-600 block w-full pl-9 sm:text-sm border-gray-300 rounded-md" placeholder="Search" />
      </div>
    </div>
  );
};

export default React.memo(SidebarSearchInput);
