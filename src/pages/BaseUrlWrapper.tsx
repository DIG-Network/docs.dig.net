import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

const BaseUrlWrapper = ({ children }) => {
  const history = useHistory();

  useEffect(() => {
    const { pathname } = window.location;

    console.log('!');
    
    // Check if we're in a dynamic baseUrl environment with 'chia' and strip it
    if (pathname.startsWith('/chia')) {
      const newPath = pathname.replace(/^\/chia\.[^/]+\//, '/');
      history.replace(newPath);
    }
  }, [history]);

  return <>{children}</>;
};

export default BaseUrlWrapper;
