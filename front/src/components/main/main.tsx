import React from 'react';
import { Header } from '../index';

export const Main = (): JSX.Element => {
  return (
    <>
      <Header/>
      <main>
        <div className='main-heading'>
          <h1>Title</h1>
        </div>
        <p className='main-teaser'>
          Custom boilerplate for rapid development of Web Applications.
          <br/>
          This project makes use of React, Webpack, TypeScript to serve
          the best environment for development with hot-reloading of modules.
        </p>
      </main>
    </>
  );
};
