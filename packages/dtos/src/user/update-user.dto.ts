import type { ICreateUserDto } from "./create-user.dto";

/**
 * Data Transfer Object (DTO) for updating a user.
 *
 * This interface extends a partial version of the `ICreateUserDto` interface,
 * omitting the `password` and `isEmailVerified` properties. It allows for
 * updating only a subset of user properties while ensuring that sensitive
 * fields like `password` and `isEmailVerified` are excluded.
 */
export interface IUpdateUserDto
  extends Partial<Omit<ICreateUserDto, "password" | "isEmailVerified">> {}
