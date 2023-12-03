import { graphql } from '@/generated';

export const csvImportDocument = graphql(`
  mutation CsvImport ($input: CsvImportInput!) {
    csvImport(input: $input) {
      success
      pack {
      ...Pack
      }
      errors {
        ...BaseError
      }
    }
  }
`);