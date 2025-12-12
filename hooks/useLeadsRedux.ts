import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchLeads, createLead, updateLead, deleteLead } from '../store/slices/leadsSlice';
import { Lead } from '../types';

export const useLeads = (filter?: any) => {
  const dispatch = useAppDispatch();
  const { leads, isLoading, error } = useAppSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads(filter));
  }, [dispatch, filter]);

  const refetch = () => {
    dispatch(fetchLeads(filter));
  };

  return {
    data: { leads },
    loading: isLoading,
    error,
    refetch,
  };
};

export const useCreateLead = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.leads);

  const mutate = async (input: Partial<Lead>) => {
    return dispatch(createLead(input)).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};

export const useUpdateLead = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.leads);

  const mutate = async ({ id, input }: { id: string; input: Partial<Lead> }) => {
    return dispatch(updateLead({ id, input })).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};

export const useDeleteLead = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.leads);

  const mutate = async (id: string) => {
    return dispatch(deleteLead(id)).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};
