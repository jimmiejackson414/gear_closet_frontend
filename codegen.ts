
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VITE_BACKEND_URL,
  documents: "src/graphql/**/*.ts",
  generates: {
    "src/generated/": {
      preset: "client",
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
