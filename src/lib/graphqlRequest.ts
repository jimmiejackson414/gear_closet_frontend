import { GraphQLClient } from 'graphql-request';
import supabase from '@/lib/supabase';

const endpoint = import.meta.env.VITE_BACKEND_URL as string;

export const useClient = async (): Promise<GraphQLClient> => {
  let token = '';
  const { data } = await supabase.auth.getSession();

  if (data?.session) {
    token = data.session.access_token;
  }

  return new GraphQLClient(endpoint, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
};
