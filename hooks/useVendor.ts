import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchVendors,
  fetchVendor,
  createVendor as createVendorAction,
  updateVendor as updateVendorAction,
  deleteVendor as deleteVendorAction,
  clearError,
} from '../store/slices/vendorSlice';

export const useVendor = () => {
  const dispatch = useAppDispatch();
  const { vendors, currentVendor, isLoading, error } = useAppSelector((state) => state.vendor);

  const getVendors = async () => {
    return dispatch(fetchVendors()).unwrap();
  };

  const getVendor = async (id: string) => {
    return dispatch(fetchVendor(id)).unwrap();
  };

  const createVendor = async (input: {
    name: string;
    slug: string;
    contactEmail: string;
    logoUrl?: string;
    theme?: { primaryColor: string };
  }) => {
    return dispatch(createVendorAction(input)).unwrap();
  };

  const updateVendor = async (
    id: string,
    input: Partial<{
      name: string;
      slug: string;
      contactEmail: string;
      logoUrl: string;
      theme: { primaryColor: string };
      isActive: boolean;
    }>
  ) => {
    return dispatch(updateVendorAction({ id, input })).unwrap();
  };

  const deleteVendor = async (id: string) => {
    return dispatch(deleteVendorAction(id)).unwrap();
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    vendors,
    currentVendor,
    isLoading,
    error,
    getVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    clearError: handleClearError,
  };
};
