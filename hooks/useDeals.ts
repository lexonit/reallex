import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import {
  GET_DEALS_QUERY,
  GET_DEAL_QUERY,
  CREATE_DEAL_MUTATION,
  UPDATE_DEAL_MUTATION,
  DELETE_DEAL_MUTATION
} from '../graphql';

export function useDeals(filter?: any, options = {}) {
  return useQuery(
    filter ? ['deals', filter] : ['deals'],
    GET_DEALS_QUERY,
    {
      variables: { filter },
      ...options
    }
  );
}

export function useDeal(id: string, options = {}) {
  return useQuery(
    ['deal', id],
    GET_DEAL_QUERY,
    {
      variables: { id },
      enabled: !!id,
      ...options
    }
  );
}

export function useCreateDeal(options = {}) {
  return useMutation(CREATE_DEAL_MUTATION, options);
}

export function useUpdateDeal(options = {}) {
  return useMutation(UPDATE_DEAL_MUTATION, options);
}

export function useDeleteDeal(options = {}) {
  return useMutation(DELETE_DEAL_MUTATION, options);
}
