import { useMutation as useTanstackMutation, UseMutationOptions as TanstackMutationOptions } from '@tanstack/react-query';
import { graphqlRequest } from '../lib/graphql';

interface UseMutationOptions extends Omit<TanstackMutationOptions, 'mutationFn'> {
  onCompleted?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useMutation<T = any>(
  mutation: string,
  options: UseMutationOptions = {}
) {
  const { onCompleted, onError, ...restOptions } = options;
  
  const { mutate, mutateAsync, data, isPending, error, reset, ...rest } = useTanstackMutation({
    mutationFn: async (variables: Record<string, any> = {}) => {
      const result = await graphqlRequest(mutation, variables);
      return result;
    },
    onSuccess: (data) => {
      if (onCompleted) {
        onCompleted(data);
      }
    },
    onError: (err) => {
      if (onError) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        onError(error);
      }
    },
    ...restOptions
  });

  return { 
    mutate: mutateAsync,
    mutateSync: mutate,
    data: data ?? null, 
    loading: isPending, 
    error: error as Error | null, 
    reset,
    ...rest
  };
}
