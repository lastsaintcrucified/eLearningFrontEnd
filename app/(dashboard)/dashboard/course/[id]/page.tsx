/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { CheckCircle, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { useDataContext } from "@/context/dataContext";
import { use, useEffect, useState } from "react";
import {
	Course,
	getCourseById,
	getModulesByCourseId,
	Module,
} from "@/lib/data/data";
import { set } from "date-fns";
import { useAuth } from "@/context/authContext";
import { Console } from "console";

export default function CoursePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { user } = useAuth();
	const [course, setCourse] = useState<Course | undefined>();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		async function fetchCourse() {
			const data = await getCourseById(id);
			setCourse(data);
			console.log("course", data);
		}
		setLoading(false);
		fetchCourse();
	}, [id, user?.role]);

	// Calculate next lesson
	// const nextLesson = course.modules
	// 	.flatMap((module) => module.lessons)
	// 	.find((lesson) => !lesson.completed);

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				{user?.role === "student" ? (
					<Link
						href='/dashboard/enrollments'
						className='text-sm text-muted-foreground hover:underline'
					>
						← Back to My Enrollments
					</Link>
				) : null}
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							{course?.title}
						</h1>
						<p className='text-muted-foreground'>
							Instructor: {course?.instructor.name}
						</p>
					</div>
					{user?.role === "student" && (
						<Button
							className='md:w-auto w-full'
							size='lg'
						>
							<PlayCircle className='mr-2 h-4 w-4' />
							Continue Learning
						</Button>
					)}
				</div>
			</div>

			<div className='grid gap-6 lg:grid-cols-3'>
				<div className='lg:col-span-2 space-y-6'>
					<Card>
						<div className='aspect-video w-full overflow-hidden'>
							<Image
								src={"/placeholder.png"}
								alt={course?.title || ""}
								className='h-full w-full object-cover'
								width={600}
								height={205}
							/>
						</div>
						<CardHeader>
							<CardTitle>Course Overview</CardTitle>
							<CardDescription>{course?.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between text-sm'>
										<span>Progress</span>
										<span>80%</span>
									</div>
									<div className='h-2 w-full rounded-full bg-secondary'>
										<div
											className='h-full rounded-full bg-primary'
											style={{ width: `80%` }}
										></div>
									</div>
									<div className='flex justify-between text-sm text-muted-foreground'>
										<span>10 / 16 lessons completed</span>
										<span>Last accessed: yesterday</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					{course?.modules.map((module, index) => (
						<Tabs
							defaultValue='content'
							className='space-y-4'
							key={module.id + index}
						>
							<TabsList>
								<TabsTrigger value='content'>Module Content</TabsTrigger>
								<TabsTrigger value='resources'>Module Resources</TabsTrigger>
								<TabsTrigger value='discussions'>Discussions</TabsTrigger>
							</TabsList>
							<TabsContent
								value='content'
								className='space-y-4'
							>
								<Card>
									<CardHeader>
										<CardTitle>{module.title}</CardTitle>
										<CardDescription className='flex items-center gap-2 justify-between'>
											<span>Details of the lessons in this module</span>
											<Button
												variant='outline'
												size='sm'
												className=''
											>
												<Link
													href={
														user?.role === "student"
															? `/dashboard/course/${id}/modules`
															: `/instructor/course/${id}/modules`
													}
												>
													Go to module
												</Link>
											</Button>
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>{}</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value='resources'>
								<Card>
									<CardHeader>
										<CardTitle>Lessons</CardTitle>
										<CardDescription>
											Download supplementary materials for this module
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											{module.lessons.length > 0 ? (
												module.lessons.map((lesson, index) => (
													<div
														key={lesson.id + index}
														className='flex items-center justify-between p-3 rounded-md border'
													>
														<div className='flex items-center gap-3'>
															<Icons.fileText className='h-5 w-5 text-muted-foreground' />
															<span>{lesson.title}</span>
														</div>
														<Button
															variant='outline'
															size='sm'
														>
															Download
														</Button>
													</div>
												))
											) : (
												<div className='flex items-center justify-between p-3 rounded-md border'>
													<div className='flex items-center gap-3'>
														<Icons.fileText className='h-5 w-5 text-muted-foreground' />
														<span>No lessons</span>
													</div>
													<Button
														variant='outline'
														size='sm'
													>
														No task
													</Button>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value='discussions'>
								<Card>
									<CardHeader>
										<CardTitle>Module Discussions</CardTitle>
										<CardDescription>
											Engage with other students and the instructor
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='flex items-center justify-center h-40'>
											<p className='text-muted-foreground'>
												Discussion forum would go here
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					))}
				</div>

				<div className='space-y-6'>
					{user?.role == "student" && (
						<Card>
							<CardHeader>
								<CardTitle>Continue Learning</CardTitle>
								<CardDescription>Pick up where you left off</CardDescription>
							</CardHeader>
							<CardContent>
								{course?.modules ? (
									<div className='space-y-4'>
										<div className='space-y-2'>
											<h3 className='font-medium'>Next Lesson:</h3>
											<div className='flex items-center gap-3 p-3 rounded-md bg-muted/50'>
												<PlayCircle className='h-5 w-5 text-primary' />
												<div className='flex-1'>
													<p className='font-medium'>Hooks</p>
													<p className='text-sm text-muted-foreground'>
														Importance of hooks
													</p>
												</div>
											</div>
											<Button className='w-full mt-2'>Start Lesson</Button>
										</div>
									</div>
								) : (
									<div className='flex flex-col items-center justify-center gap-2 py-6'>
										<Icons.check className='h-8 w-8 text-green-500' />
										<h3 className='font-medium text-center'>
											You've completed all lessons!
										</h3>
										<p className='text-sm text-muted-foreground text-center'>
											Congratulations on your progress
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					<Card>
						<CardHeader>
							<CardTitle>Course Stats</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm'>Total Duration:</span>
									<span className='text-sm font-medium'>10 hours</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm'>Difficulty:</span>
									<Badge>Intermediate</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm'>Category:</span>
									<span className='text-sm font-medium'>Programming</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm'>Last Updated:</span>
									<span className='text-sm font-medium'>2 months ago</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
