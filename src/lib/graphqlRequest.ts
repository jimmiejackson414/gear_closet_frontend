import { GraphQLClient } from 'graphql-request';
// import supabase from '@/lib/supabase';

const endpoint = import.meta.env.VITE_BACKEND_URL as string;

export const useClient = (): GraphQLClient => {
  return new GraphQLClient(endpoint, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'apiKey': import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
    },
  });
};
