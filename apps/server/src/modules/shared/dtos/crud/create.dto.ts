/**
 * A generic type that represents the body of a create DTO (Data Transfer Object).
 * This type omits the specified properties from the given type `T`.
 *
 * @template T - The type from which properties are omitted.
 * @property id - The unique identifier of the entity.
 * @property createdAt - The timestamp when the entity was created.
 * @property updatedAt - The timestamp when the entity was last updated.
 * @property userId - The identifier of the user associated with the entity.
 */
export type ICreateBodyDto<T> = Omit<
  T,
  "id" | "createdAt" | "updatedAt" | "userId" | "isEmailVerified"
>;

/**
 * Interface representing the data transfer object for creating an entity.
 *
 * @template T - The type of the data being created.
 */
export interface ICreateDto<T> {
  /**
   * User ID associated with the creation request.
   */
  userId: string;

  /**
   * The data to be created.
   */
  data: ICreateBodyDto<T>;
}
