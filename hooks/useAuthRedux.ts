import { useAppDispatch, useAppSelector } from '../store';
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    return dispatch(loginAction({ email, password })).unwrap();
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
  };
};
