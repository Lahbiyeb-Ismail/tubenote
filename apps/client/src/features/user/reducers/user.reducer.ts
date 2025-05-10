import type { UserAction, UserState } from "../types";

export function userReducer(state: UserState, action: UserAction) {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        ...state,
        message: action.payload.message,
      };
    case "UPDATE_USER_FAILD":
      return {
        ...state,
        message: action.payload.message,
      };

    default:
      return state;
  }
}
