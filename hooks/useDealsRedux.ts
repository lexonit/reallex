import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchDeals, createDeal, updateDeal, deleteDeal } from '../store/slices/dealsSlice';
import { Deal } from '../types';

export const useDeals = (filter?: any) => {
  const dispatch = useAppDispatch();
  const { deals, isLoading, error } = useAppSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchDeals(filter));
  }, [dispatch, filter]);

  const refetch = () => {
    dispatch(fetchDeals(filter));
  };

  return {
    data: { deals },
    loading: isLoading,
    error,
    refetch,
  };
};

export const useCreateDeal = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.deals);

  const mutate = async (input: Partial<Deal>) => {
    return dispatch(createDeal(input)).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};

export const useUpdateDeal = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.deals);

  const mutate = async ({ id, input }: { id: string; input: Partial<Deal> }) => {
    return dispatch(updateDeal({ id, input })).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};

export const useDeleteDeal = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.deals);

  const mutate = async (id: string) => {
    return dispatch(deleteDeal(id)).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};
