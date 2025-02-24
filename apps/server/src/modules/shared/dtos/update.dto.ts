/**
 * A generic type that represents the body of an update request.
 * It makes all properties of the given type `T` optional, except for the `id`, `createdAt`, and `updatedAt` properties, which are omitted.
 *
 * @template T - The type of the object to be updated.
 */
export type IUpdateBodyDto<T> = Partial<
  Omit<T, "id" | "createdAt" | "updatedAt">
>;

/**
 * Interface representing the structure of an update Data Transfer Object (DTO).
 *
 * @template T - The type of the data being updated.
 */
export interface IUpdateDto<T> {
  /**
   * The unique identifier of the entity to be updated.
   */
  id: string;

  /**
   * The unique identifier of the user performing the update.
   */
  userId: string;

  /**
   * The data to be updated, encapsulated in an IUpdateBodyDto.
   */
  data: IUpdateBodyDto<T>;
}
