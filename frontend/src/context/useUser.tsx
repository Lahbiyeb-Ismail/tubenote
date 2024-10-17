"use client";

import { createContext, useContext, useReducer } from "react";

import useUpdateCurrentUser from "@/hooks/useUpdateCurrentUser";
import type {
	UserContextType,
	UserProviderProps,
	UserState,
} from "@/types/user.types";
import userReducer from "@/reducers/user.reducer";

const userContext = createContext<UserContextType | undefined>(undefined);

const userInitialState: UserState = {
	user: null,
	message: "",
};

function UserProvider({ children }: UserProviderProps) {
	const [state, dispatch] = useReducer(userReducer, userInitialState);

	const updateUserMutation = useUpdateCurrentUser(dispatch);

	const value = {
		state,
		updateUser: updateUserMutation.mutate,
		isLoading: updateUserMutation.isPending,
	};

	return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

function useUser() {
	const context = useContext(userContext);

	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}

	return context;
}

export { useUser, UserProvider };
