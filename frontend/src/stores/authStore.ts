import type { UserDataType } from "@/types";
import { create } from "zustand";

interface AuthData {
  userData: UserDataType | null;
  setAuthData: (data: UserDataType) => void;
}

// const getInitialUserData = () => {
//   if (typeof window === "undefined") return null;

//   const userData = localStorage.getItem("user");
//   return userData && userData !== "{}" ? JSON.parse(userData) : null;
// };

const useAuthStore = create<AuthData>((set) => ({
  userData: null,
  setAuthData: (data) =>
    set(() => {
      return { userData: data };
    }),
}));

export default useAuthStore;
