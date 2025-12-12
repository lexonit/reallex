import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProperties, createProperty, updateProperty, deleteProperty } from '../store/slices/propertiesSlice';
import { Property } from '../types';

export const useProperties = (filter?: any) => {
  const dispatch = useAppDispatch();
  const { properties, isLoading, error } = useAppSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties(filter));
  }, [dispatch, filter]);

  const refetch = () => {
    dispatch(fetchProperties(filter));
  };

  return {
    data: { properties },
    loading: isLoading,
    error,
    refetch,
  };
};

export const useCreateProperty = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.properties);

  const mutate = async (input: Partial<Property>) => {
    return dispatch(createProperty(input)).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};

export const useUpdateProperty = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.properties);

  const mutate = async ({ id, input }: { id: string; input: Partial<Property> }) => {
    return dispatch(updateProperty({ id, input })).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};

export const useDeleteProperty = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.properties);

  const mutate = async (id: string) => {
    return dispatch(deleteProperty(id)).unwrap();
  };

  return {
    mutate,
    loading: isLoading,
    error,
  };
};
