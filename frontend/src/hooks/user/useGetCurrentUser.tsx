import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/actions/user.actions";

function useGetCurrentUser() {
	return useQuery({
		queryKey: ["current-user"],
		queryFn: getCurrentUser,
	});
}

export default useGetCurrentUser;
