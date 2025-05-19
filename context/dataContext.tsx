"use client";
import { getCourses } from "@/lib/data/data";
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

type Course = Awaited<ReturnType<typeof getCourses>>[number];

interface DataContextType {
	courses: Course[] | null;
	loading: boolean;
	error: Error | null;
}

const DataContext = createContext<DataContextType>({
	courses: null,
	loading: true,
	error: null,
});

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
	const [courses, setCourses] = useState<Course[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let mounted = true;
		getCourses()
			.then((data) => {
				if (mounted) {
					setCourses(data);
					setLoading(false);
				}
			})
			.catch((err) => {
				if (mounted) {
					setError(err);
					setLoading(false);
				}
			});
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<DataContext.Provider value={{ courses, loading, error }}>
			{children}
		</DataContext.Provider>
	);
};
