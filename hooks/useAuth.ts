import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import { ME_QUERY, LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql';

export function useMe(options = {}) {
  return useQuery('me', ME_QUERY, options);
}

export function useLogin(options = {}) {
  return useMutation(LOGIN_MUTATION, options);
}

export function useRegister(options = {}) {
  return useMutation(REGISTER_MUTATION, options);
}
