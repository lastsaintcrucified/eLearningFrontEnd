import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`; // Adjust as needed

// Signup function
export async function signup(
	name: string,
	email: string,
	password: string,
	role?: string
) {
	const response = await axios.post(`${API_URL}/signup`, {
		name,
		email,
		password,
		role,
	});
	if (response.status !== 201) {
		throw new Error("Failed to create an account");
	}
	return response.data;
}
export async function logout() {
	const response = await axios.post(`${API_URL}/logout`);
	if (response.status !== 201) {
		throw new Error("Failed to create an account");
	}
	localStorage.removeItem("jwt_token");
	return response.status;
}
// Login function
export async function login(email: string, password: string) {
	const response = await axios.post(`${API_URL}/login`, { email, password });
	const { access_token } = response.data;
	if (access_token) {
		localStorage.setItem("jwt_token", access_token);
	}
	return response.data;
}

// Get JWT token from localStorage
export function getToken() {
	return localStorage.getItem("jwt_token");
}

// Attach JWT token to axios requests
axios.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// // Example of protected route usage
// export async function getProtectedResource() {
//     const response = await axios.get(`${API_URL}/protected`);
//     return response.data;
// }
