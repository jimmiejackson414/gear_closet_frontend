import { ref } from 'vue';

interface FormValidationRules {
  [key: string]: ((value: any) => boolean | string)[];
}

const useValidate = (form: Record<string, any>, validationRules: FormValidationRules) => {
  const success = ref(false);
  const fieldErrors = ref<Record<string, string>>({});
  const submitted = ref(false);

  const validateForm = (): boolean => {
    submitted.value = true;
    success.value = true;

    for (const field in validationRules) {
      const rules = validationRules[field];

      const errors = rules
        .map((rule) => (typeof rule === 'function' ? rule(form[field]) : true))
        .filter((result) => result !== true);

      if (errors.length > 0) {
        fieldErrors.value[field] = errors[0] as string; // Store the first error message
        success.value = false;
      } else {
        fieldErrors.value[field] = ''; // Clear error message if no errors
      }
    }

    return success.value;
  };

  const validateFieldOnBlur = (field: string): void => {
    if (submitted.value) {
      validateForm();
    } else {
      fieldErrors.value[field] = '';
    }
  };

  return {
    success,
    fieldErrors,
    validateForm,
    validateFieldOnBlur,
  };
};

export default useValidate;