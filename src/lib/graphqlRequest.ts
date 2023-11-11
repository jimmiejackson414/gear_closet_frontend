import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.VITE_BACKEND_URL as string;

export const useClient = (): GraphQLClient => {
  const key = import.meta.env.VITE_SUPABASE_LOCALSTORAGE_KEY as string;
  const storage = localStorage.getItem(key) as string;
  const session = JSON.parse(storage);
  let token = '';
  if (session) token = session.access_token;

  return new GraphQLClient(endpoint, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
};
