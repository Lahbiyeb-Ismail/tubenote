import type { ICreateUserDto } from "../user";

/**
 * Represents the data transfer object (DTO) for user registration.
 *
 * This interface extends the `ICreateUserDto` interface, omitting the `isEmailVerified` property.
 * It is used to define the structure of the data required for registering a new user.
 */
export interface IRegisterDto extends Omit<ICreateUserDto, "isEmailVerified"> {}
