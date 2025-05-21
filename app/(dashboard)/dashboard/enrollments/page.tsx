"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { Enrollment, getEnrollmentsByStudent } from "@/lib/data/data";
import { Loader } from "lucide-react";

// Mock data for enrolled courses
// const enrolledCourses = [
// 	{
// 		id: 1,
// 		title: "Advanced JavaScript",
// 		instructor: "Jane Smith",
// 		progress: 45,
// 		totalLessons: 24,
// 		completedLessons: 11,
// 		image: "/placeholder.svg?height=100&width=250",
// 		lastAccessed: "2 days ago",
// 	},
// 	{
// 		id: 2,
// 		title: "React Fundamentals",
// 		instructor: "John Johnson",
// 		progress: 20,
// 		totalLessons: 18,
// 		completedLessons: 4,
// 		image: "/placeholder.svg?height=100&width=250",
// 		lastAccessed: "1 week ago",
// 	},
// 	{
// 		id: 3,
// 		title: "Node.js Basics",
// 		instructor: "Sarah Williams",
// 		progress: 10,
// 		totalLessons: 15,
// 		completedLessons: 2,
// 		image: "/placeholder.svg?height=100&width=250",
// 		lastAccessed: "2 weeks ago",
// 	},
// 	{
// 		id: 4,
// 		title: "HTML & CSS Fundamentals",
// 		instructor: "Michael Brown",
// 		progress: 100,
// 		totalLessons: 12,
// 		completedLessons: 12,
// 		image: "/placeholder.svg?height=100&width=250",
// 		lastAccessed: "1 month ago",
// 		completed: true,
// 	},
// ];

export default function EnrollmentsPage() {
	const { user } = useAuth();
	const [enrolledCourses, setEnrolledCourses] = useState<
		Enrollment[] | undefined
	>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchEnrolledCourse() {
			setLoading(true);
			const data = await getEnrollmentsByStudent(user?.role);
			setEnrolledCourses(data);
			setLoading(false);
		}

		fetchEnrolledCourse();
	}, [user?.id]);

	if (loading) {
		return <Loader className='h-8 w-8 animate-spin' />;
	}
	console.log("enrolledCourses", enrolledCourses);
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Enrollments</h1>
					<p className='text-muted-foreground'>
						Manage and track your enrolled courses
					</p>
				</div>
				<Button asChild>
					<Link href='/courses'>Browse More Courses</Link>
				</Button>
			</div>

			{enrolledCourses?.length === 0 ? (
				<div className='flex flex-col items-center justify-center gap-4'>
					<p className='text-muted-foreground mt-10'>
						No enrolled courses found.
					</p>
				</div>
			) : (
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{enrolledCourses?.map((course) => (
						<Card
							key={course.id}
							className='overflow-hidden'
						>
							<div className='aspect-video w-full overflow-hidden'>
								<Image
									src={"/placeholder.png"}
									alt={course?.course.title}
									className='h-full w-full object-cover'
									height={100}
									width={250}
								/>
							</div>
							<CardHeader className='p-4'>
								<div className='flex justify-between items-start'>
									<CardTitle className='line-clamp-1'>
										{course.course.title}
									</CardTitle>
									{course?.course && (
										<Badge
											variant='outline'
											className='bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
										>
											Completed
										</Badge>
									)}
								</div>
								<CardDescription>
									Instructor: {course.course.instructor.name}
								</CardDescription>
							</CardHeader>
							<CardContent className='p-4 pt-0'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between text-sm'>
										<span>Progress</span>
										<span>60%</span>
									</div>
									<div className='h-2 w-full rounded-full bg-secondary'>
										<div
											className='h-full rounded-full bg-primary'
											style={{ width: `60%` }}
										></div>
									</div>
									<div className='flex justify-between text-sm text-muted-foreground'>
										<span>13 / 18 lessons</span>
										<span>Last accessed: yesterday</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className='p-4 pt-0'>
								<Button
									asChild
									className='w-full'
								>
									<Link href={`/dashboard/course/${course.course.id}`}>
										{course.course ? "Review Course" : "Continue Learning"}
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
