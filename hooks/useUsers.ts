import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import {
  GET_USERS_QUERY,
  GET_USER_QUERY,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION
} from '../graphql';

export function useUsers(filter?: any, options = {}) {
  return useQuery(
    filter ? ['users', filter] : ['users'],
    GET_USERS_QUERY,
    {
      variables: { filter },
      ...options
    }
  );
}

export function useUser(id: string, options = {}) {
  return useQuery(
    ['user', id],
    GET_USER_QUERY,
    {
      variables: { id },
      enabled: !!id,
      ...options
    }
  );
}

export function useCreateUser(options = {}) {
  return useMutation(CREATE_USER_MUTATION, options);
}

export function useUpdateUser(options = {}) {
  return useMutation(UPDATE_USER_MUTATION, options);
}

export function useDeleteUser(options = {}) {
  return useMutation(DELETE_USER_MUTATION, options);
}
