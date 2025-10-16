
/**
 * Format validation errors
 * @param {import('zod').z.ZodError} errors
 * @returns {string}
 */

export const formatValidationError = (errors) => {
  if(!errors || !errors.issues) return 'Validation failed';

  if(Array.isArray(errors.issues)) return errors.issues.map(issue => `${issue.path}: ${issue.message}`).join(', ');

  return JSON.stringify(errors);
};