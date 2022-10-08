import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Container, Dashboard, Login } from '@src/components';
import { useAuth } from '@src/hooks';

export const App = (): JSX.Element => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path='/' element={user?.id ? <Navigate to='/dashboard' /> : <Login />} />
      <Route path='/dashboard' element={user?.id ? <Container><Dashboard /></Container> : <Navigate to='/' /> } />
    </Routes>
  );
};
