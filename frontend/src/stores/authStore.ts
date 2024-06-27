import type { UserDataType } from "@/types";
import { create } from "zustand";

interface AuthData {
  userData: UserDataType | null;
  setAuthData: (data: UserDataType) => void;
}

const useAuthStore = create<AuthData>((set) => ({
  userData: JSON.parse(localStorage.getItem("user") || "null") || null,
  setAuthData: (data) =>
    set(() => {
      return { userData: data };
    }),
}));

export default useAuthStore;
