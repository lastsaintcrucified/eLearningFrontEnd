import axios from "axios";
import { getToken } from "../auth";
import { User } from "@/context/authContext";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/`;

export type Role = "student" | "instructor";

export interface Course {
	id: string;
	title: string;
	description: string;
	instructor: User;
}

export interface CourseCreate {
	title: string;
	description: string;
}

export interface Enrollment {
	id: string;
	course: Course;
	student: User;
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
	title: string,
	description: string
): Promise<CourseCreate | undefined> {
	const res = await axios.post(
		`${API_URL}courses`,
		{ title, description },
		{
			headers: { "Content-Type": "application/json" },
		}
	);
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
	const res = await axios.get(`${API_URL}courses/${id}`);
	// console.log(res);
	if (res.status !== 200) {
		throw new Error("Failed to fetch course");
	}
	return res.data;
}

export async function updateCourse(
	id: string,
	title: string | undefined,
	description: string | undefined
): Promise<CourseCreate | undefined> {
	const res = await axios.patch(
		`${API_URL}courses/${id}`,
		{ title, description },
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	if (res.status !== 200) {
		throw new Error("Failed to update course");
	}
	return res.data;
}

export async function deleteCourse(id: string): Promise<boolean> {
	const res = await axios.delete(`${API_URL}courses/${id}`);
	if (res.status !== 200) {
		throw new Error("Failed to delete course");
	}

	return res.status === 200;
}

// Enrollment for student role
export async function enrollStudent(
	courseId: string,
	role: Role | undefined
): Promise<Enrollment | undefined> {
	if (role !== "student") return undefined;
	const res = await axios.post(
		`${API_URL}enrollments`,
		{ courseId },
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	if (res.status !== 201) {
		throw new Error("Failed to enroll student");
	}
	return res.data;
}

export async function getEnrollmentsByStudent(
	role: Role | undefined
): Promise<Enrollment[]> {
	if (role !== "student") return [];
	const res = await axios.get(`${API_URL}enrollments/me`, {
		headers: { "Content-Type": "application/json" },
	});
	if (res.status !== 200) {
		throw new Error("Failed to fetch enrollments");
	}
	return res.data;
}

// Modules for specific course (instructor role)
export async function getModulesByCourseId(
	courseId: string,
	role: Role
): Promise<Module[]> {
	if (role !== "instructor") return [];
	const res = await axios.get(`${API_URL}courses/${courseId}/modules`, {
		headers: { "Content-Type": "application/json" },
	});
	// console.log(res, "dfgf");
	if (res.status !== 200) {
		throw new Error("Failed to fetch modules");
	}
	return res.data;
}

export async function createModule(
	courseId: string,
	title: string,
	role: Role
): Promise<Module | undefined> {
	if (role !== "instructor") return undefined;
	const res = await axios.post(
		`${API_URL}modules`,
		{ courseId, title },
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	if (res.status !== 201) {
		throw new Error("Failed to create module");
	}

	return res.data;
}

// Lessons for specific module (instructor role)
export async function getLessonsByModuleId(
	moduleId: string,
	role: Role
): Promise<Lesson[]> {
	if (role !== "instructor") return [];
	const res = await axios.get(`${API_URL}lessons?moduleId=${moduleId}`, {
		headers: { "Content-Type": "application/json" },
	});
	if (res.status !== 200) {
		throw new Error("Failed to fetch lessons");
	}
	return res.data;
}

export async function createLesson(
	moduleId: string,
	title: string,
	role: Role
): Promise<Lesson | undefined> {
	if (role !== "instructor") return undefined;
	const res = await axios.post(
		`${API_URL}lessons`,
		{ moduleId, title },
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	if (res.status !== 201) {
		throw new Error("Failed to create lesson");
	}
	return res.data;
}
axios.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
