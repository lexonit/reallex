import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import {
  GET_LEADS_QUERY,
  GET_LEAD_QUERY,
  CREATE_LEAD_MUTATION,
  UPDATE_LEAD_MUTATION,
  DELETE_LEAD_MUTATION,
  CONVERT_LEAD_TO_DEAL_MUTATION
} from '../graphql';

export function useLeads(filter?: any, options = {}) {
  return useQuery(
    filter ? ['leads', filter] : ['leads'],
    GET_LEADS_QUERY,
    {
      variables: { filter },
      ...options
    }
  );
}

export function useLead(id: string, options = {}) {
  return useQuery(
    ['lead', id],
    GET_LEAD_QUERY,
    {
      variables: { id },
      enabled: !!id,
      ...options
    }
  );
}

export function useCreateLead(options = {}) {
  return useMutation(CREATE_LEAD_MUTATION, options);
}

export function useUpdateLead(options = {}) {
  return useMutation(UPDATE_LEAD_MUTATION, options);
}

export function useDeleteLead(options = {}) {
  return useMutation(DELETE_LEAD_MUTATION, options);
}

export function useConvertLeadToDeal(options = {}) {
  return useMutation(CONVERT_LEAD_TO_DEAL_MUTATION, options);
}
