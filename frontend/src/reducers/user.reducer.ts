import type { UserAction, UserState } from "@/types/user.types";

function userReducer(state: UserState, action: UserAction) {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload.user,
        message: action.payload.message,
      };
    case "UPDATE_USER_FAILD":
      return {
        ...state,
        user: null,
        message: action.payload.message,
      };

    default:
      return state;
  }
}

export default userReducer;
