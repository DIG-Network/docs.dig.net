import React from 'react';
import BaseUrlWrapper from '../pages/BaseUrlWrapper';

const Root = ({ children }) => {
  return <BaseUrlWrapper>{children}</BaseUrlWrapper>;
};

export default Root;