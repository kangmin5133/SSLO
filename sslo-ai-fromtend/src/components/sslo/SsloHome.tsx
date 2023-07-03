import React from 'react';
import { Outlet } from 'react-router-dom';
import SsloFooter from './SsloFooter';
import SsloHeader from './SsloHeader';

const SsloHome = () => {
  return (
    <>
      <SsloHeader />
      <Outlet />
      <SsloFooter />
    </>
  );
};

export default SsloHome;
