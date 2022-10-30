import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@src/components/header/header';

export const Container = (): JSX.Element => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
