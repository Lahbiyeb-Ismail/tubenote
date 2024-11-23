import type { User } from '.';

export type UpdateUserProps = {
  username: string;
  email: string;
};

export type UserState = {
  message: string;
};

export type UserContextType = {
  state: UserState;
  updateUser: (user: UpdateUserProps) => void;
  isLoading: boolean;
};

export type UserAction = {
  type: string;
  payload: { message: string };
};

export type UserProviderProps = {
  children: React.ReactNode;
};
