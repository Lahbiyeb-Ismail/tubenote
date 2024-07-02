import type { UserDataType } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthData {
  userData: UserDataType | null;
  setAuthData: (data: UserDataType) => void;
}

export const useAuthStore = create<AuthData>()(
  persist(
    (set) => ({
      userData: null,
      setAuthData: (data) =>
        set(() => {
          return { userData: data };
        }),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
