import React from 'react';
import { Header } from '@src/components/header/header';

export const Container = ({ children }: React.PropsWithChildren): JSX.Element => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};
