import Cookies from 'js-cookie';

const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';
const COOKIE_NAME = 'auth_token';

export const graphqlRequest = async (query: string, variables: any = {}) => {
  // Frontend should call the API; avoid importing backend code into the browser bundle.
  let token = Cookies.get(COOKIE_NAME);
  
  // Fallback to localStorage if cookie not found
  if (!token) {
    token = localStorage.getItem('token');
  }

  console.log('📡 graphqlRequest: Sending request', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    source: Cookies.get(COOKIE_NAME) ? 'cookie' : 'localStorage'
  });

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error('❌ GraphQL error:', result.errors);
    throw new Error(result.errors[0].message);
  }

  return result.data;
};
