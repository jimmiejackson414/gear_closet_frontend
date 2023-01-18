// utility to match graphql mutation based on the operation name
export const hasOperationName = (req: { body: any; }, operationName: any): boolean => {
  const { body } = req;
  return (
    // eslint-disable-next-line no-prototype-builtins
    body.hasOwnProperty('operationName') && body.operationName === operationName
  );
};

// alias query if operationName matches
export const aliasQuery = (req, operationName): void => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
  }
};

// alias mutation if operationName matches
export const aliasMutation = (req, operationName): void => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};
