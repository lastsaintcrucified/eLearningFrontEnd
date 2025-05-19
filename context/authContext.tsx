/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getToken, login, logout } from "@/lib/auth";
import { Role } from "@/lib/data/data";
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
	role?: Role;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		// console.log("AuthProvider mounted");
		const token = getToken();
		if (token) {
			// Optionally decode token to get user info

			const userData = localStorage.getItem("user_data");
			if (userData) {
				setUser(JSON.parse(userData));
			}
		} else {
			// console.log("No token found");
			setUser(null);
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
		}
	};

	const handleLogout = async () => {
		await logout();
		localStorage.removeItem("user_data");
		setUser(null);
		router.push("/login");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login: handleLogin,
				logout: handleLogout,
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
		const router = useRouter();

		useEffect(() => {
			const token = getToken();
			const isAuthenticated = !!token;
			if (!isAuthenticated) {
				// console.log(isAuthenticated, "not authenticated");

				router.replace("/login");
			}
		}, [, router]);

		return <WrappedComponent {...props} />;
	};
}
