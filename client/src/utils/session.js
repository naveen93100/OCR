const TOKEN_KEY = "access_token";
const USER_KEY = "user";

// TODO: add the other roles and their real paths
export const ROLE_HOME = {
    executive: "/executive",
};

export const saveSession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
        USER_KEY,
        JSON.stringify({
            ...user,
            role: String(user?.role || "").toLowerCase(),
        }),
    );
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
};

export const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};
