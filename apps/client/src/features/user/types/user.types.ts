import type { IUpdateUserDto } from "@tubenote/dtos";

export type UserState = {
  message: string;
};

export type UserContextType = {
  state: UserState;
  updateUser: (data: IUpdateUserDto) => void;
  isLoading: boolean;
};

export type UserAction = {
  type: string;
  payload: { message: string };
};

export type UserProviderProps = {
  children: React.ReactNode;
};
