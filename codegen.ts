import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config: CodegenConfig = {
  schema: process.env.VITE_BACKEND_URL,
  documents: ['./src/graphql/**/*.gql'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/generated/types.ts': {
      plugins: [ 
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
       ],
       config: {
        withRefetchFn: true,
        preResolveTypes: true,
        fetcher: 'graphql-request',
        gqlImport: 'graphql-request#gql',
        pureMagicComment: true,
        experimentalFragmentVariables: true,
        dedupeFragments: true,
        useTypeImports: true,
       },
    },
  },
};
 
export default config;