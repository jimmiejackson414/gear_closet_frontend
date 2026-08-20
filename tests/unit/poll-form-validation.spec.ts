import { describe, expect, it } from 'vitest';
import { validatePollForm } from '@/utils/pollFormValidation';

describe('validatePollForm', () => {
  it('requires a question and at least two answers', () => {
    const result = validatePollForm({
      question: '',
      answers: [''],
    });

    expect(result.ok)
      .toBe(false);
    expect(result.errors.question)
      .toBe('Question is required.');
    expect(result.errors.answers)
      .toBe('Add at least two answers.');
  });

  it('accepts trimmed question and answer values', () => {
    const result = validatePollForm({
      question: '  Where should we hike?  ',
      answers: [' Trail A ', 'Trail B', '   '],
    });

    expect(result.ok)
      .toBe(true);
    expect(result.filledAnswers)
      .toEqual(['Trail A', 'Trail B']);
  });
});
