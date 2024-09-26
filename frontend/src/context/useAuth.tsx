"use client";

import { createContext, useContext, useReducer } from "react";

import type { AuthContextType, AuthProviderProps } from "@/types/auth.types";

import useRegisterMutation from "@/hooks/useRegisterMutation";
import authReducer, { authInitialState } from "@/reducers/auth.reducer";
import useLoginMutation from "@/hooks/useLoginMutation";
import useLogoutMutation from "@/hooks/useLogoutMutation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, dispatch] = useReducer(authReducer, authInitialState);

	const registerMutation = useRegisterMutation(dispatch);
	const loginMutation = useLoginMutation(dispatch);
	const logoutMutation = useLogoutMutation(dispatch);

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
