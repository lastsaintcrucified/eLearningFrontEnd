/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Mock course data
const course = {
	id: 1,
	title: "Advanced JavaScript",
	instructor: "Jane Smith",
	description:
		"Master advanced JavaScript concepts including closures, prototypes, async programming, and more.",
	progress: 45,
	totalLessons: 24,
	completedLessons: 11,
	image: "/placeholder.svg?height=200&width=600",
	lastAccessed: "2 days ago",
	modules: [
		{
			id: 1,
			title: "JavaScript Fundamentals Review",
			lessons: [
				{
					id: 1,
					title: "Variables and Data Types",
					duration: "15 min",
					completed: true,
				},
				{
					id: 2,
					title: "Functions and Scope",
					duration: "20 min",
					completed: true,
				},
				{
					id: 3,
					title: "Objects and Arrays",
					duration: "25 min",
					completed: true,
				},
			],
		},
		{
			id: 2,
			title: "Advanced Concepts",
			lessons: [
				{ id: 4, title: "Closures", duration: "30 min", completed: true },
				{
					id: 5,
					title: "Prototypes and Inheritance",
					duration: "35 min",
					completed: true,
				},
				{ id: 6, title: "This Keyword", duration: "25 min", completed: true },
				{
					id: 7,
					title: "Call, Apply, and Bind",
					duration: "20 min",
					completed: true,
				},
			],
		},
		{
			id: 3,
			title: "Asynchronous JavaScript",
			lessons: [
				{ id: 8, title: "Callbacks", duration: "20 min", completed: true },
				{ id: 9, title: "Promises", duration: "30 min", completed: true },
				{ id: 10, title: "Async/Await", duration: "35 min", completed: true },
				{ id: 11, title: "Event Loop", duration: "25 min", completed: true },
				{
					id: 12,
					title: "Practical Examples",
					duration: "40 min",
					completed: false,
				},
			],
		},
		{
			id: 4,
			title: "Modern JavaScript",
			lessons: [
				{
					id: 13,
					title: "ES6+ Features",
					duration: "30 min",
					completed: false,
				},
				{ id: 14, title: "Modules", duration: "25 min", completed: false },
				{
					id: 15,
					title: "Destructuring",
					duration: "20 min",
					completed: false,
				},
				{
					id: 16,
					title: "Spread and Rest Operators",
					duration: "15 min",
					completed: false,
				},
			],
		},
		{
			id: 5,
			title: "JavaScript Design Patterns",
			lessons: [
				{
					id: 17,
					title: "Module Pattern",
					duration: "25 min",
					completed: false,
				},
				{
					id: 18,
					title: "Singleton Pattern",
					duration: "20 min",
					completed: false,
				},
				{
					id: 19,
					title: "Factory Pattern",
					duration: "25 min",
					completed: false,
				},
				{
					id: 20,
					title: "Observer Pattern",
					duration: "30 min",
					completed: false,
				},
			],
		},
		{
			id: 6,
			title: "JavaScript Performance",
			lessons: [
				{
					id: 21,
					title: "Memory Management",
					duration: "25 min",
					completed: false,
				},
				{
					id: 22,
					title: "Optimization Techniques",
					duration: "30 min",
					completed: false,
				},
				{ id: 23, title: "Debugging", duration: "25 min", completed: false },
				{
					id: 24,
					title: "Performance Testing",
					duration: "35 min",
					completed: false,
				},
			],
		},
	],
};

export default function CoursePage({ params }: { params: { id: string } }) {
	const courseId = Number.parseInt(params.id);

	// Calculate next lesson
	const nextLesson = course.modules
		.flatMap((module) => module.lessons)
		.find((lesson) => !lesson.completed);

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				<Link
					href='/dashboard/enrollments'
					className='text-sm text-muted-foreground hover:underline'
				>
					← Back to My Enrollments
				</Link>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							{course.title}
						</h1>
						<p className='text-muted-foreground'>
							Instructor: {course.instructor}
						</p>
					</div>
					{nextLesson && (
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
								src={course.image || "/placeholder.svg"}
								alt={course.title}
								className='h-full w-full object-cover'
								height={100}
								width={250}
							/>
						</div>
						<CardHeader>
							<CardTitle>Course Overview</CardTitle>
							<CardDescription>{course.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between text-sm'>
										<span>Progress</span>
										<span>{course.progress}%</span>
									</div>
									<div className='h-2 w-full rounded-full bg-secondary'>
										<div
											className='h-full rounded-full bg-primary'
											style={{ width: `${course.progress}%` }}
										></div>
									</div>
									<div className='flex justify-between text-sm text-muted-foreground'>
										<span>
											{course.completedLessons} / {course.totalLessons} lessons
											completed
										</span>
										<span>Last accessed: {course.lastAccessed}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Tabs
						defaultValue='content'
						className='space-y-4'
					>
						<TabsList>
							<TabsTrigger value='content'>Course Content</TabsTrigger>
							<TabsTrigger value='resources'>Resources</TabsTrigger>
							<TabsTrigger value='discussions'>Discussions</TabsTrigger>
						</TabsList>
						<TabsContent
							value='content'
							className='space-y-4'
						>
							<div className='space-y-4'>
								{course.modules.map((module, index) => (
									<Card key={module.id}>
										<CardHeader className='py-3'>
											<CardTitle className='text-lg'>
												Module {index + 1}: {module.title}
											</CardTitle>
										</CardHeader>
										<CardContent className='py-0'>
											<div className='space-y-2'>
												{module.lessons.map((lesson) => (
													<div
														key={lesson.id}
														className={`flex items-center justify-between p-3 rounded-md ${
															lesson.completed
																? "bg-muted/50"
																: "hover:bg-muted/50 cursor-pointer"
														}`}
													>
														<div className='flex items-center gap-3'>
															{lesson.completed ? (
																<CheckCircle className='h-5 w-5 text-green-500' />
															) : (
																<PlayCircle className='h-5 w-5 text-muted-foreground' />
															)}
															<span>{lesson.title}</span>
														</div>
														<div className='flex items-center gap-2'>
															<Clock className='h-4 w-4 text-muted-foreground' />
															<span className='text-sm text-muted-foreground'>
																{lesson.duration}
															</span>
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
						<TabsContent value='resources'>
							<Card>
								<CardHeader>
									<CardTitle>Course Resources</CardTitle>
									<CardDescription>
										Download supplementary materials for this course
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='flex items-center justify-between p-3 rounded-md border'>
											<div className='flex items-center gap-3'>
												<Icons.fileText className='h-5 w-5 text-muted-foreground' />
												<span>Course Slides</span>
											</div>
											<Button
												variant='outline'
												size='sm'
											>
												Download
											</Button>
										</div>
										<div className='flex items-center justify-between p-3 rounded-md border'>
											<div className='flex items-center gap-3'>
												<Icons.fileText className='h-5 w-5 text-muted-foreground' />
												<span>Exercise Files</span>
											</div>
											<Button
												variant='outline'
												size='sm'
											>
												Download
											</Button>
										</div>
										<div className='flex items-center justify-between p-3 rounded-md border'>
											<div className='flex items-center gap-3'>
												<Icons.fileText className='h-5 w-5 text-muted-foreground' />
												<span>Cheat Sheet</span>
											</div>
											<Button
												variant='outline'
												size='sm'
											>
												Download
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value='discussions'>
							<Card>
								<CardHeader>
									<CardTitle>Course Discussions</CardTitle>
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
				</div>

				<div className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Continue Learning</CardTitle>
							<CardDescription>Pick up where you left off</CardDescription>
						</CardHeader>
						<CardContent>
							{nextLesson ? (
								<div className='space-y-4'>
									<div className='space-y-2'>
										<h3 className='font-medium'>Next Lesson:</h3>
										<div className='flex items-center gap-3 p-3 rounded-md bg-muted/50'>
											<PlayCircle className='h-5 w-5 text-primary' />
											<div className='flex-1'>
												<p className='font-medium'>{nextLesson.title}</p>
												<p className='text-sm text-muted-foreground'>
													{nextLesson.duration}
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
