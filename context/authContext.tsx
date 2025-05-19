/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getToken, login, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface User {
	id: number;
	name: string;
	email: string;
	role?: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const token = getToken();
		if (token) {
			// Optionally decode token to get user info
			const userData = localStorage.getItem("user_data");
			if (userData) {
				setUser(JSON.parse(userData));
			}
			setIsAuthenticated(true);
		} else {
			setUser(null);
			setIsAuthenticated(false);
		}
	}, []);

	const handleLogin = async (email: string, password: string) => {
		const { access_token, user } = await login(email, password);
		if (access_token) {
			// Optionally fetch user profile from backend
			// For now, just store email
			const userData: User = { ...user };
			localStorage.setItem("user_data", JSON.stringify(userData));
			setUser(userData);
			setIsAuthenticated(true);
		}
	};

	const handleLogout = async () => {
		await logout();
		localStorage.removeItem("user_data");
		setUser(null);
		setIsAuthenticated(false);
		router.push("/login");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login: handleLogin,
				logout: handleLogout,
				isAuthenticated,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Route guard HOC
export function withAuth(
	WrappedComponent: React.ComponentType<React.PropsWithChildren<any>>
) {
	return function AuthenticatedComponent(props: React.PropsWithChildren<any>) {
		const { isAuthenticated } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!isAuthenticated) {
				router.replace("/login");
			}
		}, [isAuthenticated, router]);

		if (!isAuthenticated) {
			return null;
		}
		return <WrappedComponent {...props} />;
	};
}
