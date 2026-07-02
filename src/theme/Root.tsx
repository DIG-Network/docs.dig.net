import React from 'react';
import BaseUrlWrapper from '../components/BaseUrlWrapper';

const Root = ({ children }) => {
  return <BaseUrlWrapper>{children}</BaseUrlWrapper>;
};

export default Root;