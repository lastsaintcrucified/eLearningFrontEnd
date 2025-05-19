/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { useDataContext } from "@/context/dataContext";
import { useAuth } from "@/context/authContext";
import { Course, deleteCourse, getCourses } from "@/lib/data/data";
import { useToast } from "@/components/ui/use-toast";

// Mock data for instructor courses
// const instructorCourses = [
// 	{
// 		id: 1,
// 		title: "Advanced JavaScript",
// 		status: "published",
// 		students: 245,
// 		lessons: 24,
// 		lastUpdated: "2 weeks ago",
// 		image: "/placeholder.svg?height=100&width=250",
// 		revenue: "$4,320",
// 		rating: 4.8,
// 	},
// 	{
// 		id: 2,
// 		title: "React Hooks Masterclass",
// 		status: "published",
// 		students: 189,
// 		lessons: 18,
// 		lastUpdated: "1 month ago",
// 		image: "/placeholder.svg?height=100&width=250",
// 		revenue: "$3,150",
// 		rating: 4.7,
// 	},
// 	{
// 		id: 3,
// 		title: "Node.js API Development",
// 		status: "draft",
// 		students: 0,
// 		lessons: 12,
// 		lastUpdated: "3 days ago",
// 		image: "/placeholder.svg?height=100&width=250",
// 		revenue: "$0",
// 		rating: 0,
// 	},
// ];

export default function InstructorCoursesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const { loading } = useDataContext();
	const { user } = useAuth();
	const [courses, setCourses] = useState<Course[]>([]);
	const { toast } = useToast();
	useEffect(() => {
		async function fetchCourses() {
			try {
				const data = await getCourses();
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		}
		fetchCourses();
	}, []);

	const instructorCourses = courses?.filter(
		(course) => course.instructor.id === user?.id
	);
	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader className='h-8 w-8 animate-spin' />
			</div>
		);
	}
	const handleDelete = async (id: string) => {
		try {
			await deleteCourse(id);
			toast({
				title: "Deleted Course",
				description: "Successfully deleted course",
				variant: "default",
			});
			setCourses((prevCourses) =>
				prevCourses.filter((course) => course.id !== id)
			);
		} catch (error: any) {
			toast({
				title: "Error deleting course",
				description: "Failed to delete course",
				variant: "destructive",
			});
		}
	};

	const filteredCourses = instructorCourses?.filter((course) =>
		course.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Courses</h1>
					<p className='text-muted-foreground'>
						Manage and track your created courses
					</p>
				</div>
				<Button asChild>
					<Link href='/instructor/create'>
						<Plus className='mr-2 h-4 w-4' />
						Create New Course
					</Link>
				</Button>
			</div>

			<div className='flex items-center gap-4'>
				<div className='relative flex-1'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search courses...'
						className='pl-8'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Course Overview</CardTitle>
					<CardDescription>
						A list of all your courses and their performance
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Course</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='hidden md:table-cell'>Students</TableHead>
								<TableHead className='hidden md:table-cell'>Lessons</TableHead>
								<TableHead className='hidden md:table-cell'>Rating</TableHead>
								<TableHead className='hidden md:table-cell'>Revenue</TableHead>
								<TableHead className='hidden md:table-cell'>
									Last Updated
								</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCourses?.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className='text-center py-8'
									>
										<div className='flex flex-col items-center justify-center gap-2'>
											<Icons.blocked className='h-8 w-8 text-muted-foreground' />
											<p className='text-muted-foreground'>No courses found</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredCourses?.map((course) => (
									<TableRow key={course.id}>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Image
													src={"/placeholder.png"}
													alt={course.title}
													className='h-10 w-16 rounded object-cover'
													height={100}
													width={250}
												/>
												<div className='font-medium'>{course.title}</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant='outline'>Published</Badge>
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											{"230"}
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											{"12"}
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											{"-"}
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											{"1,234,00"}
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											{"yesterday"}
										</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
													>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>Actions</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem asChild>
														<Link href={`/instructor/update/${course.id}`}>
															Edit Course
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link
															href={`/instructor/course/${course.id}/analytics`}
														>
															View Analytics
														</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDelete(course.id)}
														className='text-destructive'
													>
														Delete Course
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<div className='grid gap-6 md:grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Students
						</CardTitle>
						<Icons.user className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{instructorCourses?.reduce((acc, course) => acc + 230, 0)}
						</div>
						<p className='text-xs text-muted-foreground'>
							+12% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							className='h-4 w-4 text-muted-foreground'
						>
							<path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
						</svg>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>$7,470</div>
						<p className='text-xs text-muted-foreground'>+8% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Average Rating
						</CardTitle>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							className='h-4 w-4 text-muted-foreground'
						>
							<path d='M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z' />
						</svg>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>4.75</div>
						<p className='text-xs text-muted-foreground'>
							+0.2 from last month
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
