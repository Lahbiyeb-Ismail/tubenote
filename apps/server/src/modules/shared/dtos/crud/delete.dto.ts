/**
 * Data Transfer Object (DTO) for deleting an entity.
 *
 * @interface IDeleteDto
 * @property {string} id - The unique identifier of the entity to be deleted.
 * @property {string} userId - The unique identifier of the user requesting the deletion.
 */
export interface IDeleteDto {
  id: string;
  userId: string;
}
