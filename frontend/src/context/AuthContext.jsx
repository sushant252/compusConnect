
import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [loading, setLoading] = useState(true);

    // Restore logged-in user when app loads
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await API.get("/auth/me");

                setUser(
                    response.data.user || response.data
                );
            } catch (error) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    // Login
    const login = async (email, password) => {
        const response = await API.post("/auth/login", {
            email,
            password
        });

        const { token: newToken, user: loggedInUser } =
            response.data;

        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(loggedInUser);

        return loggedInUser;
    };

    // Register
    // Register
    const register = async (userData) => {
    const response = await API.post("/auth/register", userData);

    return response.data.user;
};

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};
