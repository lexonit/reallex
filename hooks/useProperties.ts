import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import {
  GET_PROPERTIES_QUERY,
  GET_PROPERTY_QUERY,
  CREATE_PROPERTY_MUTATION,
  UPDATE_PROPERTY_MUTATION,
  DELETE_PROPERTY_MUTATION
} from '../graphql';

export function useProperties(filter?: any, userId?: string, options = {}) {
  return useQuery(
    filter ? ['properties', filter, userId] : ['properties', userId],
    GET_PROPERTIES_QUERY,
    {
      variables: { filter },
      ...options
    }
  );
}

export function useProperty(id: string, options = {}) {
  return useQuery(
    ['property', id],
    GET_PROPERTY_QUERY,
    {
      variables: { id },
      enabled: !!id,
      ...options
    }
  );
}

export function useCreateProperty(options = {}) {
  return useMutation(CREATE_PROPERTY_MUTATION, options);
}

export function useUpdateProperty(options = {}) {
  return useMutation(UPDATE_PROPERTY_MUTATION, options);
}

export function useDeleteProperty(options = {}) {
  return useMutation(DELETE_PROPERTY_MUTATION, options);
}
