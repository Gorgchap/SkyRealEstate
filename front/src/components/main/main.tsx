import React from 'react';

export const Main = (): JSX.Element => {
  return (
    <main>
      <div className='main-heading'>
        <h1>Title</h1>
      </div>
      <p className='main-teaser'>
        Custom boilerplate for rapid development of Web Applications.
        <br />
        This project makes use of React, Webpack, TypeScript to serve
        the best environment for development with hot-reloading of modules.
      </p>
      <div className='versions'>
        <span>RWT <span>1.0.0</span></span>
        <span>React <span>18</span></span>
      </div>
      <p className='main-teaser small'>
        Click below button to update the application &quot;counter&quot;
        state. Components will update their states using Hot-Module-Replacement
        technique, without needing to refresh/reload whole application.
      </p>
    </main>
  );
};
