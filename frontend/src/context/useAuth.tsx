"use client";

import { createContext, useContext, useReducer } from "react";

import type { AuthContextType, AuthProviderProps } from "@/types/auth.types";

import useRegister from "@/hooks/auth/useRegister";
import useLogin from "@/hooks/auth/useLogin";
import  {  useAuthReducer } from "@/reducers/auth.reducer";
import useLogout from "@/hooks/auth/useLogout";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const {authInitialState, authReducer} = useAuthReducer();
	const [state, dispatch] = useReducer(authReducer, authInitialState);

	const registerMutation = useRegister(dispatch);
	const loginMutation = useLogin(dispatch);
	const logoutMutation = useLogout(dispatch);

	const value = {
		state,
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		logout: logoutMutation.mutate,
		isLoading:
			registerMutation.isPending ||
			loginMutation.isPending ||
			logoutMutation.isPending,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
