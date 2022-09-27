import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@src/hooks';

export const Container = ({ children }: React.PropsWithChildren): JSX.Element => {
  const { user } = useAuth();
  return !user.id ? (
    <Navigate to='/' replace />
  ) : (
    <>{children}</>
  );
};
