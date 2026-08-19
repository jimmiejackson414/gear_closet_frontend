export type PollFormValidationErrors = {
  question?: string;
  answers?: string;
};

export function validatePollForm (input: {
  question: string;
  answers: string[];
}): {
  ok: boolean;
  errors: PollFormValidationErrors;
  filledAnswers: string[];
} {
  const errors: PollFormValidationErrors = {};
  const question = input.question.trim();

  if (!question) {
    errors.question = 'Question is required.';
  } else if (question.length < 3) {
    errors.question = 'Question must be at least 3 characters.';
  }

  const filledAnswers = input.answers
    .map((answer) => answer.trim())
    .filter(Boolean);

  if (filledAnswers.length < 2) {
    errors.answers = 'Add at least two answers.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    filledAnswers,
  };
}
