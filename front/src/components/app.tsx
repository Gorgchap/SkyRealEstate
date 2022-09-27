import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login, Main, Container } from '@src/components';
import { useAuth } from '@src/hooks';
import './app.less';

export const App = (): JSX.Element => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path='/' element={user.id ? <Navigate to='/main' /> : <Login /> } />
      <Route path='/main' element={<Container><Main /></Container>} />
    </Routes>
  );
};
