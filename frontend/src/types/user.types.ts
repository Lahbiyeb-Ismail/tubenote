import type { User } from '.';

export type UserState = {
  user: User | null;
  message: string;
};

export type UserContextType = {
  state: UserState;
  updateUser: (user: User) => void;
  isLoading: boolean;
};

export type UserAction = {
  type: string;
  payload: { user: User | null; message: string };
};

export type UserProviderProps = {
  children: React.ReactNode;
};
