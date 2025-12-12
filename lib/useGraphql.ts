import { useCallback } from 'react';
import Cookies from 'js-cookie';
import { graphqlRequest } from './graphql';

const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // 'lax' allows cookie to persist
  path: '/', // Ensure cookie is available across all routes
};

// Small helper hook to make authenticated GraphQL calls and manage token storage
export const useGraphql = () => {
  const getToken = () => Cookies.get(COOKIE_NAME) || null;

  const setToken = (token: string | null) => {
    if (token) {
      Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    } else {
      Cookies.remove(COOKIE_NAME);
    }
  };

  const clearToken = () => setToken(null);

  const request = useCallback(async (query: string, variables: any = {}) => {
    return graphqlRequest(query, variables);
  }, []);

  return { request, getToken, setToken, clearToken };
};
