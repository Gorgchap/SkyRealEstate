import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser, login, logout } from '@src/api';
import { Credentials, UserInfo } from '@src/models';

interface Context {
  error: string;
  onLogin: (credentials: Credentials) => Promise<void>;
  onLogout: () => Promise<void>;
  user: UserInfo;
}

const AuthContext = createContext({} as Context);

export const AuthProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<UserInfo>({} as UserInfo);

  const getUser = useCallback(async () => {
    try {
      !checked && setUser(await currentUser());
    } catch (err) {
      navigate('/', { replace: true });
    } finally {
      setChecked(true);
    }
  }, [checked]);

  const onLogin = async (credentials: Credentials): Promise<void> => {
    try {
      await login(credentials);
      setUser(await currentUser());
      setError('');
      navigate('/dashboard', { replace: true });
    } catch(e) {
      setError(e?.message || 'Произошла неизвестная ошибка');
    }
  };

  const onLogout = async (): Promise<void> => {
    await logout();
    setUser({} as UserInfo);
    navigate('/', { replace: true });
  };

  const value = useMemo(() => ({ error, onLogin, onLogout, user }), [error, user]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
