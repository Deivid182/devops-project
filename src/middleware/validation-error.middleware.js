import { BadRequestException } from '#exceptions/index';
import { formatValidationError } from '#validations/format';
/** 
 * @template T
 * @param {{ schema: import('zod').ZodObject<T>, data: Record<string, unknown> }} params
 * @returns {T}
 */
export const validationError = ({ schema, data }) => {
  const validationResult = schema.safeParse(data);

  if (!validationResult.success) {
    throw new BadRequestException(formatValidationError(validationResult.error));
  }

  return validationResult.data;
};