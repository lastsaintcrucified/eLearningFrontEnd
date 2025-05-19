import axios from "axios";
import { getToken } from "../auth";
import { User } from "@/context/authContext";

const API_URL = "http://localhost:3000/";

type Role = "student" | "instructor";

export interface Course {
	id: string;
	title: string;
	description: string;
	instructor: User;
}

export interface Enrollment {
	id: string;
	courseId: string;
	studentId: string;
}

export interface Module {
	id: string;
	courseId: string;
	title: string;
}

export interface Lesson {
	id: string;
	moduleId: string;
	title: string;
}

// Courses
export async function createCourse(
	course: Omit<Course, "id">
): Promise<Course> {
	const res = await axios.post(`${API_URL}courses`, course, {
		headers: { "Content-Type": "application/json" },
	});
	if (res.status !== 201) {
		throw new Error("Failed to create course");
	}
	return res.data;
}

export async function getCourses(): Promise<Course[]> {
	const res = await axios.get(`${API_URL}courses`);
	if (res.status !== 200) {
		throw new Error("Failed to fetch courses");
	}
	return res.data;
}

export async function getCourseById(id: string): Promise<Course | undefined> {
	const res = await fetch(`${API_URL}courses/${id}`);
	if (!res.ok) return undefined;
	return res.json();
}

export async function updateCourse(
	id: string,
	data: Partial<Omit<Course, "id">>
): Promise<Course | undefined> {
	const res = await fetch(`${API_URL}courses/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) return undefined;
	return res.json();
}

export async function deleteCourse(id: string): Promise<boolean> {
	const res = await fetch(`${API_URL}courses/${id}`, { method: "DELETE" });
	return res.ok;
}

// Enrollment for student role
export async function enrollStudent(
	courseId: string,
	studentId: string,
	role: Role
): Promise<Enrollment | undefined> {
	if (role !== "student") return undefined;
	const res = await fetch(`${API_URL}enrollments`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ courseId, studentId }),
	});
	if (!res.ok) return undefined;
	return res.json();
}

export async function getEnrollmentsByStudent(
	studentId: string,
	role: Role
): Promise<Enrollment[]> {
	if (role !== "student") return [];
	const res = await fetch(`${API_URL}enrollments?studentId=${studentId}`);
	return res.json();
}

// Modules for specific course (instructor role)
export async function getModulesByCourseId(
	courseId: string,
	role: Role
): Promise<Module[]> {
	if (role !== "instructor") return [];
	const res = await fetch(`${API_URL}modules?courseId=${courseId}`);
	return res.json();
}

export async function createModule(
	courseId: string,
	title: string,
	role: Role
): Promise<Module | undefined> {
	if (role !== "instructor") return undefined;
	const res = await fetch(`${API_URL}modules`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ courseId, title }),
	});
	if (!res.ok) return undefined;
	return res.json();
}

// Lessons for specific module (instructor role)
export async function getLessonsByModuleId(
	moduleId: string,
	role: Role
): Promise<Lesson[]> {
	if (role !== "instructor") return [];
	const res = await fetch(`${API_URL}lessons?moduleId=${moduleId}`);
	return res.json();
}

export async function createLesson(
	moduleId: string,
	title: string,
	role: Role
): Promise<Lesson | undefined> {
	if (role !== "instructor") return undefined;
	const res = await fetch(`${API_URL}lessons`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ moduleId, title }),
	});
	if (!res.ok) return undefined;
	return res.json();
}
axios.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
