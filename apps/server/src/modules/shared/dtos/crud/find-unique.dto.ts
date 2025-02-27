/**
 * Data Transfer Object (DTO) for finding a unique entity.
 *
 * @interface IFindUniqueDto
 * @property {string} id - The unique identifier of the entity.
 * @property {string} userId - The unique identifier of the user associated with the entity.
 */
export interface IFindUniqueDto {
  id: string;
  userId: string;
}
