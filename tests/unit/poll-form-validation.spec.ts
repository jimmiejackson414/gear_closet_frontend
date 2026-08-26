import { describe, expect, it } from 'vitest';
import { validatePollForm } from '@/utils/pollFormValidation';

describe('validatePollForm', () => {
  it('requires a question and at least two answers', () => {
    const result = validatePollForm({
      answers: [''],
      question: '',
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
      answers: [' Trail A ', 'Trail B', '   '],
      question: '  Where should we hike?  ',
    });

    expect(result.ok)
      .toBe(true);
    expect(result.filledAnswers)
      .toEqual(['Trail A', 'Trail B']);
  });
});
