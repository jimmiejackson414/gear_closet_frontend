import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.VITE_BACKEND_URL as string;

export const useClient = (): GraphQLClient => {
  const session = localStorage.getItem('supabase.auth.token');
  let token = '';
  if (session) token = JSON.parse(session).currentSession.access_token;

  return new GraphQLClient(endpoint, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
};
