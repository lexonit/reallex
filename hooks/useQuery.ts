import { useQuery as useTanstackQuery, UseQueryOptions as TanstackQueryOptions } from '@tanstack/react-query';
import { graphqlRequest } from '../lib/graphql';

interface UseQueryOptions extends Omit<TanstackQueryOptions, 'queryKey' | 'queryFn'> {
  variables?: Record<string, any>;
}

export function useQuery<T = any>(
  queryKey: string | string[],
  query: string,
  options: UseQueryOptions = {}
) {
  const { variables = {}, ...restOptions } = options;
  
  const { data, isLoading, error, refetch, ...rest } = useTanstackQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey, variables],
    queryFn: async () => {
      const result = await graphqlRequest(query, variables);
      return result;
    },
    ...restOptions
  });

  return { 
    data: data ?? null, 
    loading: isLoading, 
    error: error as Error | null, 
    refetch,
    ...rest
  };
}
