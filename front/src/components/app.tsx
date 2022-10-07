import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login, Main } from '@src/components';
import { useAuth } from '@src/hooks';

export const App = (): JSX.Element => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path='/' element={user.id ? <Navigate to='/main' /> : <Login /> } />
      <Route path='/main' element={user.id ? <Main /> : <Navigate to='/' /> } />
    </Routes>
  );
};
