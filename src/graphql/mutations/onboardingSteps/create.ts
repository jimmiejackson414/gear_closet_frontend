import { graphql } from '@/generated';

export const createOnboardingStepDocument = graphql(`
  mutation CreateOnboardingStep($input: CreateOnboardStepInput!) {
    createOnboardStep(input:$input) {
      onboardingStep {
        ...OnboardingStep
      }
      errors {
        ...BaseError
      }
    }
  }
`);