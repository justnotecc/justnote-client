import React, { useState, useEffect, useMemo } from 'react';

import { APP_DOMAIN_NAME, BLOCKSTACK_AUTH } from '../types/const';
import { separateUrlAndParam } from '../utils';

const genAppBlockstackAuthUrl = () => {
  const url = window.location.href;
  const { param: { authResponse } } = separateUrlAndParam(url, 'authResponse');
  return APP_DOMAIN_NAME + BLOCKSTACK_AUTH + '?authResponse=' + authResponse;
}

const BlockstackAuth = React.memo(() => {

  const [hasTimeout, setHasTimeout] = useState(false);
  const blockstackAuthUrl = useMemo(() => genAppBlockstackAuthUrl(), []);

  useEffect(() => {
    window.location.replace(blockstackAuthUrl);
    setTimeout(() => setHasTimeout(true), 3000);
  }, [blockstackAuthUrl]);

  return (
    <div className="px-4 bg-gray-200 min-h-screen md:px-6 lg:px-8">
      <section className="pt-12 pb-4">
        <div style={{ borderRadius: '1.5rem' }} className="mx-auto px-4 pt-8 pb-8 w-full max-w-md bg-white">
          <h1 className="text-2xl text-gray-900 font-semibold text-center">Justnote is processing...</h1>
          <div className={`mt-6 text-gray-700 text-center ${hasTimeout ? '' : 'hidden'}`}>
            <p>Normally, it would take just a few seconds to process your sign up/sign in request.</p>
            <p className="mt-4">If this page is still showing, please click <a className="underline focus:outline-none focus:shadow-outline" href={blockstackAuthUrl}>here</a>.</p>
          </div>
        </div>
      </section>
    </div>
  );
});

export default BlockstackAuth;
