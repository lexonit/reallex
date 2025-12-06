
import { graphql } from 'graphql';
import { schema } from '../backend/graphql/schema';
import { rootValue } from '../backend/graphql/resolvers';

const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

export const graphqlRequest = async (query: string, variables: any = {}) => {
  try {
    // 1. Attempt to fetch from the real backend
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    // If the server is reachable but returns a non-200 status (e.g. 404, 500)
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;

  } catch (error) {
    // 2. Fallback: If fetch fails (network error, connection refused), run GraphQL locally.
    // This allows the demo to work without a running backend server.
    console.warn('Backend connection failed, falling back to local mock resolver:', error);

    try {
      const result = await graphql({
        schema,
        source: query,
        rootValue,
        variableValues: variables,
      });

      if (result.errors && result.errors.length > 0) {
        console.error('Local GraphQL Error:', result.errors);
        throw new Error(result.errors[0].message);
      }

      // Simulate a small network delay for realism
      await new Promise(resolve => setTimeout(resolve, 400));

      return result.data;
    } catch (localError) {
      console.error('Local GraphQL Execution Failed:', localError);
      throw localError;
    }
  }
};
