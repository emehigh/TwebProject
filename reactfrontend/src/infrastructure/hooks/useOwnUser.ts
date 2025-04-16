import { useAppSelector } from "@application/store"
import {useGetUser} from "@infrastructure/apis/api-management";
import { UserRoleEnum } from "@infrastructure/apis/client";
import { jwtDecode } from "jwt-decode";
import { isUndefined } from "lodash";

/**
 * You can use this hook to retrieve the own user from the backend.
 * You can create new hooks by using and combining other hooks.
 */
export const useOwnUser = () => {
    const { userId } = useAppSelector(x => x.profileReducer); // Get the own user id from the redux storage.
    const token = useAppSelector(x => x.profileReducer.token); // Get the token from the redux storage.
    if (token){
        const data = jwtDecode(token) as any;
        return data;
    }
    return null;
}

/**
 * This hook returns if the current user has the given role (case-insensitive).
 */
export const useOwnUserHasRole = (role: UserRoleEnum) => {
    const ownUser = useOwnUser();

    if (isUndefined(ownUser)) {
        return false; // Return false if the user is undefined
    }

    // Convert both roles and the input role to lowercase for case-insensitive comparison
    return ownUser?.roles?.some((userRole: string) => userRole.toLowerCase() === role.toLowerCase());
};

/**
 * This hook returns if the JWT token has expired or not.
 */
export const useTokenHasExpired = () => {
    const { loggedIn, exp } = useAppSelector(x => x.profileReducer);
    const now = Date.now() / 1000;

    return {
        loggedIn,
        hasExpired: !exp || exp < now
    };
}